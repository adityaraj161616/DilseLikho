"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Download, Share, FileText, ImageIcon } from "lucide-react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import type { IShayari } from "@/lib/models/Shayari"

interface ExportOptionsProps {
  shayari: IShayari
}

const themes = [
  { value: "classic", label: "Classic", bg: "bg-gradient-to-br from-amber-50 to-amber-100", text: "text-amber-900" },
  { value: "romantic", label: "Romantic", bg: "bg-gradient-to-br from-pink-50 to-rose-100", text: "text-rose-900" },
  { value: "elegant", label: "Elegant", bg: "bg-gradient-to-br from-slate-50 to-gray-100", text: "text-slate-900" },
  { value: "nature", label: "Nature", bg: "bg-gradient-to-br from-green-50 to-emerald-100", text: "text-emerald-900" },
]

export function ExportOptions({ shayari }: ExportOptionsProps) {
  const { toast } = useToast()
  const [selectedTheme, setSelectedTheme] = useState("classic")
  const [isExporting, setIsExporting] = useState(false)
  const exportRef = useRef<HTMLDivElement>(null)

  const selectedThemeData = themes.find((t) => t.value === selectedTheme) || themes[0]

  const exportAsPDF = async () => {
    if (!exportRef.current) return

    setIsExporting(true)
    try {
      const canvas = await html2canvas(exportRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
      })

      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const imgWidth = 210
      const pageHeight = 295
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      let position = 0

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save(`${shayari.title}.pdf`)
      toast({
        title: "Success!",
        description: "Shayari exported as PDF successfully",
      })
    } catch (error) {
      console.error("Error exporting PDF:", error)
      toast({
        title: "Error",
        description: "Failed to export PDF",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const exportAsImage = async () => {
    if (!exportRef.current) return

    setIsExporting(true)
    try {
      const canvas = await html2canvas(exportRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
      })

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = `${shayari.title}.png`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)

          toast({
            title: "Success!",
            description: "Shayari exported as image successfully",
          })
        }
      }, "image/png")
    } catch (error) {
      console.error("Error exporting image:", error)
      toast({
        title: "Error",
        description: "Failed to export image",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const shareAsImage = async () => {
    if (!exportRef.current) return

    setIsExporting(true)
    try {
      const canvas = await html2canvas(exportRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
      })

      canvas.toBlob(async (blob) => {
        if (blob) {
          if (navigator.share && navigator.canShare) {
            const file = new File([blob], `${shayari.title}.png`, { type: "image/png" })
            if (navigator.canShare({ files: [file] })) {
              try {
                await navigator.share({
                  title: shayari.title,
                  text: "Check out this beautiful Shayari from Dil Se Likho",
                  files: [file],
                })
              } catch (error) {
                console.log("Error sharing:", error)
              }
            }
          } else {
            // Fallback: download the image
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = `${shayari.title}.png`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)

            toast({
              title: "Downloaded!",
              description: "Image downloaded. You can now share it manually.",
            })
          }
        }
      }, "image/png")
    } catch (error) {
      console.error("Error sharing image:", error)
      toast({
        title: "Error",
        description: "Failed to share image",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="ink-drop bg-transparent">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Export Your Shayari</DialogTitle>
        </DialogHeader>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Preview */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Choose Theme</label>
              <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {themes.map((theme) => (
                    <SelectItem key={theme.value} value={theme.value}>
                      {theme.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
              <div
                ref={exportRef}
                className={`w-full aspect-[3/4] ${selectedThemeData.bg} ${selectedThemeData.text} p-8 rounded-lg shadow-lg flex flex-col justify-center items-center text-center relative overflow-hidden`}
              >
                {/* Decorative elements */}
                <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-current opacity-30"></div>
                <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-current opacity-30"></div>
                <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-current opacity-30"></div>
                <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-current opacity-30"></div>

                {/* Content */}
                <div className="space-y-6 max-w-md">
                  <h1 className="font-playfair text-2xl font-bold">{shayari.title}</h1>
                  <div className="space-y-2 font-playfair text-lg leading-relaxed">
                    {shayari.content.split("\n").map((line, index) => (
                      <div key={index}>{line.trim() || <br />}</div>
                    ))}
                  </div>
                  <div className="text-sm opacity-70">
                    {new Date(shayari.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>

                {/* Branding */}
                <div className="absolute bottom-6 text-xs opacity-50">Dil Se Likho</div>
              </div>
            </div>
          </div>

          {/* Export Options */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Export Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={exportAsPDF} disabled={isExporting} className="w-full ink-drop">
                  <FileText className="w-4 h-4 mr-2" />
                  {isExporting ? "Exporting..." : "Download as PDF"}
                </Button>

                <Button
                  onClick={exportAsImage}
                  disabled={isExporting}
                  variant="outline"
                  className="w-full bg-transparent"
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  {isExporting ? "Exporting..." : "Download as Image"}
                </Button>

                <Button
                  onClick={shareAsImage}
                  disabled={isExporting}
                  variant="outline"
                  className="w-full bg-transparent"
                >
                  <Share className="w-4 h-4 mr-2" />
                  {isExporting ? "Sharing..." : "Share as Image"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Export Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p>• PDF exports are perfect for printing and archiving</p>
                <p>• Image exports are great for social media sharing</p>
                <p>• All exports include your Shayari with beautiful typography</p>
                <p>• Choose different themes to match your mood</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
