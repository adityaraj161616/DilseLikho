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
        scale: window.devicePixelRatio || 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: exportRef.current.offsetWidth,
        height: exportRef.current.offsetHeight,
      })

      const imgData = canvas.toDataURL("image/png", 1.0)
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

      pdf.save(`${shayari.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.pdf`)
      toast({
        title: "Success!",
        description: "Shayari exported as PDF successfully",
      })
    } catch (error) {
      console.error("Error exporting PDF:", error)
      toast({
        title: "Error",
        description: "Failed to export PDF. Please try again.",
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
        scale: window.devicePixelRatio || 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: exportRef.current.offsetWidth,
        height: exportRef.current.offsetHeight,
      })

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = `${shayari.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.png`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)

            toast({
              title: "Success!",
              description: "Shayari exported as image successfully",
            })
          } else {
            throw new Error("Failed to create image blob")
          }
        },
        "image/png",
        1.0,
      )
    } catch (error) {
      console.error("Error exporting image:", error)
      toast({
        title: "Error",
        description: "Failed to export image. Please try again.",
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
        scale: window.devicePixelRatio || 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: exportRef.current.offsetWidth,
        height: exportRef.current.offsetHeight,
      })

      canvas.toBlob(
        async (blob) => {
          if (blob) {
            if (navigator.share && navigator.canShare) {
              const file = new File([blob], `${shayari.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.png`, {
                type: "image/png",
              })
              if (navigator.canShare({ files: [file] })) {
                try {
                  await navigator.share({
                    title: shayari.title,
                    text: "Check out this beautiful Shayari from Dil Se Likho",
                    files: [file],
                  })
                  toast({
                    title: "Shared!",
                    description: "Shayari shared successfully",
                  })
                } catch (error) {
                  if ((error as Error).name !== "AbortError") {
                    console.log("Error sharing:", error)
                    // Fallback to download
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement("a")
                    a.href = url
                    a.download = `${shayari.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.png`
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
              }
            } else {
              // Fallback: download the image
              const url = URL.createObjectURL(blob)
              const a = document.createElement("a")
              a.href = url
              a.download = `${shayari.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.png`
              document.body.appendChild(a)
              a.click()
              document.body.removeChild(a)
              URL.revokeObjectURL(url)

              toast({
                title: "Downloaded!",
                description: "Image downloaded. You can now share it manually.",
              })
            }
          } else {
            throw new Error("Failed to create image blob")
          }
        },
        "image/png",
        1.0,
      )
    } catch (error) {
      console.error("Error sharing image:", error)
      toast({
        title: "Error",
        description: "Failed to share image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="ink-drop bg-transparent w-full sm:w-auto">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-6xl max-h-[95vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="p-6 pb-0 flex-shrink-0">
          <DialogTitle className="text-xl sm:text-2xl">Export Your Shayari</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Preview Section */}
            <div className="space-y-4 order-2 xl:order-1">
              <div>
                <label className="text-sm font-medium mb-2 block">Choose Theme</label>
                <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                  <SelectTrigger className="w-full">
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

              <div className="border rounded-lg p-2 sm:p-4 bg-gray-50 dark:bg-gray-900">
                <div
                  ref={exportRef}
                  className={`w-full max-w-sm mx-auto aspect-[3/4] ${selectedThemeData.bg} ${selectedThemeData.text} p-4 sm:p-8 rounded-lg shadow-lg flex flex-col justify-center items-center text-center relative overflow-hidden`}
                >
                  {/* Decorative elements */}
                  <div className="absolute top-2 sm:top-4 left-2 sm:left-4 w-6 sm:w-8 h-6 sm:h-8 border-l-2 border-t-2 border-current opacity-30"></div>
                  <div className="absolute top-2 sm:top-4 right-2 sm:right-4 w-6 sm:w-8 h-6 sm:h-8 border-r-2 border-t-2 border-current opacity-30"></div>
                  <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 w-6 sm:w-8 h-6 sm:h-8 border-l-2 border-b-2 border-current opacity-30"></div>
                  <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 w-6 sm:w-8 h-6 sm:h-8 border-r-2 border-b-2 border-current opacity-30"></div>

                  {/* Content */}
                  <div className="space-y-3 sm:space-y-6 max-w-xs sm:max-w-md px-2">
                    <h1 className="font-playfair text-lg sm:text-2xl font-bold leading-tight">{shayari.title}</h1>
                    <div className="space-y-1 sm:space-y-2 font-playfair text-sm sm:text-lg leading-relaxed max-h-48 sm:max-h-64 overflow-y-auto">
                      {shayari.content.split("\n").map((line, index) => (
                        <div key={index}>{line.trim() || <br />}</div>
                      ))}
                    </div>
                    <div className="text-xs sm:text-sm opacity-70">
                      {new Date(shayari.createdAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>

                  {/* Branding */}
                  <div className="absolute bottom-2 sm:bottom-6 text-xs opacity-50">Dil Se Likho</div>
                </div>
              </div>
            </div>

            {/* Export Options Section */}
            <div className="space-y-4 order-1 xl:order-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Export Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <Button
                    onClick={exportAsPDF}
                    disabled={isExporting}
                    className="w-full ink-drop h-12 text-sm sm:text-base"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    {isExporting ? "Exporting..." : "Download as PDF"}
                  </Button>

                  <Button
                    onClick={exportAsImage}
                    disabled={isExporting}
                    variant="outline"
                    className="w-full bg-transparent h-12 text-sm sm:text-base"
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    {isExporting ? "Exporting..." : "Download as Image"}
                  </Button>

                  <Button
                    onClick={shareAsImage}
                    disabled={isExporting}
                    variant="outline"
                    className="w-full bg-transparent h-12 text-sm sm:text-base"
                  >
                    <Share className="w-4 h-4 mr-2" />
                    {isExporting ? "Sharing..." : "Share as Image"}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Export Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  <p>• PDF exports are perfect for printing and archiving</p>
                  <p>• Image exports are great for social media sharing</p>
                  <p>• All exports include your Shayari with beautiful typography</p>
                  <p>• Choose different themes to match your mood</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
