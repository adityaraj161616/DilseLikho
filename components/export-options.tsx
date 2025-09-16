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

  const createCanvas = async () => {
    if (!exportRef.current) throw new Error("Export element not found")

    console.log("[v0] Starting canvas creation...")

    // Wait for fonts to load
    await document.fonts.ready
    await new Promise((resolve) => setTimeout(resolve, 500))

    const element = exportRef.current
    console.log("[v0] Element dimensions:", element.offsetWidth, "x", element.offsetHeight)

    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
      allowTaint: false,
      foreignObjectRendering: false,
      logging: true,
      width: 600,
      height: 800,
      onclone: (clonedDoc) => {
        console.log("[v0] Cloning element for canvas...")

        // Find the export element in cloned document
        const exportElement = clonedDoc.querySelector("[data-export-ref]") as HTMLElement
        if (exportElement) {
          // Force fixed dimensions and styling
          exportElement.style.width = "600px"
          exportElement.style.height = "800px"
          exportElement.style.position = "relative"
          exportElement.style.display = "flex"
          exportElement.style.flexDirection = "column"
          exportElement.style.justifyContent = "center"
          exportElement.style.alignItems = "center"
          exportElement.style.textAlign = "center"
          exportElement.style.padding = "60px"
          exportElement.style.fontFamily = "Playfair Display, serif"
          exportElement.style.fontSize = "18px"
          exportElement.style.lineHeight = "1.6"
          exportElement.style.color =
            selectedTheme === "classic"
              ? "#92400e"
              : selectedTheme === "romantic"
                ? "#881337"
                : selectedTheme === "elegant"
                  ? "#0f172a"
                  : "#064e3b"

          // Set background based on theme
          if (selectedTheme === "classic") {
            exportElement.style.background = "linear-gradient(to bottom right, #fef3c7, #fde68a)"
          } else if (selectedTheme === "romantic") {
            exportElement.style.background = "linear-gradient(to bottom right, #fdf2f8, #fce7f3)"
          } else if (selectedTheme === "elegant") {
            exportElement.style.background = "linear-gradient(to bottom right, #f8fafc, #f1f5f9)"
          } else {
            exportElement.style.background = "linear-gradient(to bottom right, #ecfdf5, #d1fae5)"
          }

          // Style all child elements
          const allElements = exportElement.querySelectorAll("*")
          allElements.forEach((el) => {
            const element = el as HTMLElement
            element.style.fontFamily = "Playfair Display, serif"
            element.style.color = "inherit"
            element.style.visibility = "visible"
            element.style.opacity = "1"
          })

          // Style title
          const title = exportElement.querySelector("h1")
          if (title) {
            ;(title as HTMLElement).style.fontSize = "32px"
            ;(title as HTMLElement).style.fontWeight = "bold"
            ;(title as HTMLElement).style.marginBottom = "40px"
          }

          // Style content lines
          const contentDiv = exportElement.querySelector(".space-y-1, .space-y-2")
          if (contentDiv) {
            ;(contentDiv as HTMLElement).style.fontSize = "20px"
            ;(contentDiv as HTMLElement).style.lineHeight = "1.8"
            ;(contentDiv as HTMLElement).style.marginBottom = "40px"
          }

          console.log("[v0] Applied styling to cloned element")
        }
      },
    })

    console.log("[v0] Canvas created:", canvas.width, "x", canvas.height)

    if (canvas.width === 0 || canvas.height === 0) {
      throw new Error("Canvas has no content - check element visibility and styling")
    }

    return canvas
  }

  const exportAsPDF = async () => {
    setIsExporting(true)
    try {
      console.log("[v0] Starting PDF export...")
      const canvas = await createCanvas()

      const imgData = canvas.toDataURL("image/png", 1.0)
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const imgWidth = 210
      const pageHeight = 295
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)

      const fileName = shayari.title.replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s+/g, "_") || "shayari"
      pdf.save(`${fileName}.pdf`)

      console.log("[v0] PDF exported successfully")
      toast({
        title: "Success!",
        description: "Shayari exported as PDF successfully",
      })
    } catch (error) {
      console.error("[v0] Error exporting PDF:", error)
      toast({
        title: "Error",
        description: `Failed to export PDF: ${(error as Error).message}`,
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const exportAsImage = async () => {
    setIsExporting(true)
    try {
      console.log("[v0] Starting JPG export...")
      const canvas = await createCanvas()

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            const fileName = shayari.title.replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s+/g, "_") || "shayari"
            a.download = `${fileName}.jpg`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)

            console.log("[v0] JPG exported successfully")
            toast({
              title: "Success!",
              description: "Shayari exported as JPG successfully",
            })
          } else {
            throw new Error("Failed to create image blob")
          }
        },
        "image/jpeg",
        0.95,
      )
    } catch (error) {
      console.error("[v0] Error exporting image:", error)
      toast({
        title: "Error",
        description: `Failed to export image: ${(error as Error).message}`,
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const shareAsImage = async () => {
    setIsExporting(true)
    try {
      console.log("[v0] Starting share...")
      const canvas = await createCanvas()

      canvas.toBlob(
        async (blob) => {
          if (blob) {
            const fileName = shayari.title.replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s+/g, "_") || "shayari"

            if (navigator.share && navigator.canShare) {
              const file = new File([blob], `${fileName}.jpg`, { type: "image/jpeg" })
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
                    console.log("[v0] Error sharing:", error)
                    // Fallback to download
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement("a")
                    a.href = url
                    a.download = `${fileName}.jpg`
                    document.body.appendChild(a)
                    a.click()
                    document.body.removeChild(a)
                    URL.revokeObjectURL(url)

                    toast({
                      title: "Downloaded!",
                      description: "Image downloaded as JPG. You can now share it manually.",
                    })
                  }
                }
              }
            } else {
              // Fallback to download
              const url = URL.createObjectURL(blob)
              const a = document.createElement("a")
              a.href = url
              a.download = `${fileName}.jpg`
              document.body.appendChild(a)
              a.click()
              document.body.removeChild(a)
              URL.revokeObjectURL(url)

              toast({
                title: "Downloaded!",
                description: "Image downloaded as JPG. You can now share it manually.",
              })
            }
          } else {
            throw new Error("Failed to create image blob")
          }
        },
        "image/jpeg",
        0.95,
      )
    } catch (error) {
      console.error("[v0] Error sharing image:", error)
      toast({
        title: "Error",
        description: `Failed to share image: ${(error as Error).message}`,
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="ink-drop bg-transparent text-sm sm:text-base">
          <Download className="w-4 h-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Export</span>
          <span className="sm:hidden">Export</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-6xl h-[95vh] max-h-[95vh] overflow-hidden flex flex-col p-3 sm:p-6">
        <DialogHeader className="flex-shrink-0 pb-2 sm:pb-4">
          <DialogTitle className="text-lg sm:text-xl">Export Your Shayari</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 h-full">
            {/* Preview Section */}
            <div className="space-y-3 sm:space-y-4 order-2 lg:order-1">
              <div>
                <label className="text-sm font-medium mb-2 block">Choose Theme</label>
                <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                  <SelectTrigger className="h-10 sm:h-12">
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
                  data-export-ref="true"
                  className={`w-full aspect-[3/4] ${selectedThemeData.bg} ${selectedThemeData.text} p-8 rounded-lg shadow-lg flex flex-col justify-center items-center text-center relative overflow-hidden`}
                  style={{
                    fontFamily: "Playfair Display, serif",
                    minHeight: "400px",
                  }}
                >
                  {/* Decorative elements */}
                  <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-current opacity-30"></div>
                  <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-current opacity-30"></div>
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-current opacity-30"></div>
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-current opacity-30"></div>

                  {/* Content */}
                  <div className="space-y-6 max-w-md px-4">
                    <h1 className="font-playfair text-2xl font-bold break-words">{shayari.title}</h1>
                    <div className="space-y-2 font-playfair text-lg leading-relaxed">
                      {shayari.content.split("\n").map((line, index) => (
                        <div key={index} className="break-words">
                          {line.trim() || <br />}
                        </div>
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

            {/* Export Options Section */}
            <div className="space-y-3 sm:space-y-4 order-1 lg:order-2">
              <Card className="h-fit">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-base sm:text-lg">Export Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <Button
                    onClick={exportAsPDF}
                    disabled={isExporting}
                    className="w-full ink-drop h-12 sm:h-14 text-sm sm:text-base"
                  >
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    {isExporting ? "Exporting..." : "Download as PDF"}
                  </Button>

                  <Button
                    onClick={exportAsImage}
                    disabled={isExporting}
                    variant="outline"
                    className="w-full bg-transparent h-12 sm:h-14 text-sm sm:text-base"
                  >
                    <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    {isExporting ? "Exporting..." : "Download as JPG"}
                  </Button>

                  <Button
                    onClick={shareAsImage}
                    disabled={isExporting}
                    variant="outline"
                    className="w-full bg-transparent h-12 sm:h-14 text-sm sm:text-base"
                  >
                    <Share className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    {isExporting ? "Sharing..." : "Share as JPG"}
                  </Button>
                </CardContent>
              </Card>

              <Card className="h-fit">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-base sm:text-lg">Export Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  <p>• PDF exports are perfect for printing and archiving</p>
                  <p>• JPG exports are great for social media sharing</p>
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
