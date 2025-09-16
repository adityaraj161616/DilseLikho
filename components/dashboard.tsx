"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ShayariCard } from "@/components/shayari-card"
import { TopShayaris } from "@/components/top-shayaris"
import { useToast } from "@/hooks/use-toast"
import { Plus, Search, Filter, Heart, Calendar, BookOpen, Sparkles, ChevronLeft, ChevronRight } from "lucide-react"
import type { IShayari } from "@/lib/models/Shayari"

const featuredShayaris = [
  {
    id: 1,
    title: "मेरी सिसकियों का दर्द",
    content: `Meri siskiyo ko sunne tum toh n aaye the,
Mere hasne ki wajah bhi ab mt bano n,
Har raatein humne tadapkar bitaye h,
Tum bhi thoda machlo n,
Hawas k libaz m jhutha pyr dikhakr,
Hume u jeetna chahte ho,
Aree jao miya hum woh nhi jiske saath tum har raat bitate ho...`,
    mood: "sad",
    author: "Sushhh....🖤",
  },
  {
    id: 2,
    title: "बदलाव का अहसास",
    content: `Ab purane se nhi rahe tum,
Badalne k dhun m pure badal se gye ho,
Jaha mafi m afsoos jhalakte the,
Waha ab galtiya chupane ko'i love u jaan' kehte ho...
Fikr rehti thi meri tumhe,tumhari baton se hamne jana tha,
Ab toh ansun bhi nikal jate h,
Toh ehsaas sa jatate ho.
Meri un dino ki taqleef ko tum toh samjh pate the,
Ab bhi usi dard m reht h hum
Toh aafat ka naam kehlate ho
Jaan .... Nhi hota toh ab keh bhi do,
Q iss rishte ka bojh uthate ho......`,
    mood: "sad",
    author: "Sushhh....🖤",
  },
  {
    id: 3,
    title: "खुशी की तलाश",
    content: `Kuch kehna tha
Sun paoge ky
Hamari Khushi reh gyi h tumhare pass
Wapas kr paoge ky
Humne jis shiddat se mohobbat ki h
Uss jaisa krna tumhare bass ki baat nhi
Pr insaaniyat k Nate thodi sharm kr paoge ky
Hame jinda lash banake
Khud hass rhe ho
Wahhh..... Iss tarah pyr dusre se bhi nibha paoge ky
Or suno
Suna h woh bhi bhut mohobbat krte h tumhse
Kaho iss bar unnke pyr ka janaja uthwaoge ky........`,
    mood: "sad",
    author: "Sushhh....🖤",
  },
  {
    id: 4,
    title: "स्वार्थी कहलाने का दर्द",
    content: `Dr.cute Un logon k liye -Jo mujhe selfish kehte or shayd kahe---
Mana meine bhut galtiya ki hongi,
Pr SHYD usse kisi ka nuksaan nhi hua.
Ha mana KI m jiddi hu,
Lekin kbhi aap logon ko manane ka mauka bhi ni diya.
Ha mana ki mujhme hazaron khamiya h,
Toh aapko mere saath rehne ki zabardasti b ni ki.
Ha mana meine usse chorr diya,
Isliye shayd ki ab usse meri zaroori nhi.
Ha mana meine ki ab hu m kisi or ki,
Iska mtlb yeh ki mujhe bhi khush hone ka thoda haq toh h hi.......`,
    mood: "sad",
    author: "Sushhh....🖤",
  },
  {
    id: 5,
    title: "टूटे हुए सपने",
    content: `Kuch ummid nhi mujhe iss jamane m,
kuch jyada ki toot gye h ab,
ki jodne bhi agar koi aayega
toh hum usse chubh jayenge...
ek hi h jise hum,
siddat ki mohobbat krte h
woh sene se laga le toh hum
mukkamal ho jayenge....`,
    mood: "sad",
    author: "Sushhh....🖤",
  },
  {
    id: 6,
    title: "वादों की गुहार",
    content: `Suno jaan......
Kuch wade tumhe nibhane h nibhaoge ky......
Thoda or pyr chahiye tha hame kar paoge ky......
Tum meri har khwahishe puri na kr pao chalega,...
Pr har lamha tumhara haath mere haath pr rakh paoge ky......
Har dafa mujhse milne ki jaroorat nhi...
Magar mere jehen m hamesha reh paoge ky
Tumhe pasand woh payal, bindi woh chudiya hum jante h...
Hum hamesha sajenge tumhare liye...
Kaho Tum hame dekhne aaoge ky
Jaaaann ..yeh kuch wade h tumhe nibhane h kaho nibhaoge ky ......`,
    mood: "romantic",
    author: "Sushhh....🖤",
  },
  {
    id: 7,
    title: "खुशनुमा जिंदगी",
    content: `Khushnuma si h jindigi...
Ek chai ki pyali sa ban jao na tum,
Andheri is raat m bhul jau m sab kuch,...
Toh aisa koi geet ban jao n tum....`,
    mood: "happy",
    author: "Sushhh....🖤",
  },
  {
    id: 8,
    title: "अलग होने का एहसास",
    content: `Kitne alag h hum dono...
Ajeeb si baat h,...
Kuch toh baat hogi hamare is rishte m jo ye khaas h,...
Jalti h duniya...Q ki hum na sunte unki bakwas h,...
Pyar ka matlab shayd unhe pata nhi,...
Q ki dikhaw e k rishte hamesha bina jazbaat h..`,
    mood: "philosophical",
    author: "Sushhh....🖤",
  },
  {
    id: 9,
    title: "वफादारी का मतलब",
    content: `Ky matlab uss pyr ka jo jhuthi buniyaadi se tika h...
Kambakhta takleef toh hame ho rhi h jo...
Wafadari se hamne nibhayi h`,
    mood: "sad",
    author: "Sushhh....🖤",
  },
  {
    id: 10,
    title: "किस्मत का खेल",
    content: `Suna h...
Woh bhut pyara h,...
Hamse kehta h ki dilaka Hara h,...
Uski takeelefen sirf mujhe dikh pati h,...
Shayd ek m hi hu jo use smjh pati h ....
Uske ek muskurahat m hi meri akhein tiki hoti h,...
Lekin uske muskaan ki wajah bhi toh hum hi hote h...
Bhut darta h woh mujhe aakh uthakr dekhne pr bhi.......
Kehta h pyr h use mujhse....

Hayeee kaisi h hamari kismat...
Tum chaho jise woh milta kha h...
Meine bhi agar Maan liya hame bhi mohobbat h unse...
Toh lagta usse yeh sapne jaisa h
Hayee tujhe kaise btau meri jaan tujsa mere naseeb m milna jaise sapne ka poora hone jaise h`,
    mood: "romantic",
    author: "Sushhh....🖤",
  },
  {
    id: 11,
    title: "अधूरे या पूरे",
    content: `He - hum adhure rhengge ya pure
She - kyu achank ky hua tumhe
He - ni btao na adhure ya pure?
She - woh toh nhi malum mujhe...
Jitna mujhe maalum h woh h ki...
Agar pure hue toh Shiv Parvati...
Or agar adhure hue toh Radha Krishna...
Sanbhavtahh....`,
    mood: "philosophical",
    author: "Sushhh....🖤",
  },
  {
    id: 12,
    title: "मजबूरी का एहसास",
    content: `Majeel tumhari di hui jaroor h...
Magar chlna meine chaha h...
Chahta toh cheeh lata tumhe...
Magar tum dobara wapas mujhe pehle jaise milogi kha......
Sushhh...`,
    mood: "sad",
    author: "Sushhh....🖤",
  },
  {
    id: 13,
    title: "उसके बारे में",
    content: `Chalo kuch suna du uske baare m...
Ha woh h thoda jiddi bachpana jo h usme dekha meine...
Krti hu uski jeedein puri mein...
Jbse apna h jana usse meine
Mohobbat khu ya jaroorat usse meri...
Har dafa woh chahiye mujhe jo
Umar na sahi magar jawani kati h us sang meine...
Toh kaise khu ki pyaar nhi mera wo

Doston ki jaroorat puri krta woh...
Meri har taqleefein samjhta woh
Safar ki kbhi chinta na krta wo...
Kehta mein hoon n tum socho mt, or...
Handel jo krta wo
Meine ki buraiya uski logon k samne wo...
Jo mujhe btaya pyaar m hota yeh sab toh easy lo
Khtm na krna chahunga yeh rishta jo kehta wo...
Or uski jid jo puri krti hui mein woh.....`,
    mood: "romantic",
    author: "Sushhh....🖤",
  },
  {
    id: 14,
    title: "फिर मिलना",
    content: `Fir woh mujhe talashega...
 Or fir m usse mil jaungi, pyaar sirf ek hi h...
Jo mein hi har baar nibhaungi...
Uska saath nibhanna mera farz toh nhi...
Na hi majboori h
Mana aaj smjha nhi mere pyaar ko usme...
Pr kl ko tarsega yeh jaroori h.....`,
    mood: "romantic",
    author: "Sushhh....🖤",
  },
  {
    id: 15,
    title: "वक्त की कमी",
    content: `Suno ruk skte ho,
Fir wahi baat,...
Jane m waqt lg jayegi,,
Thik h aaj bhi tum le kr nhi aaye woh,
Ky,,...
Jo taufa sabse mehnnga h,
Ky mtlb,,...
Waqt janab jo tumhare pass kbhi tha nhi,

Fir wahi baatein,,...
Tum q un baatein m uljhi ho ab tk,,...
Bhul q nhi jati,,...
Kuch or kehna h toh kho jldi,,
Ha wahi kehna tha,...
Ky,,...
Suno ruk skte ho......`,
    mood: "sad",
    author: "Sushhh....🖤",
  },
  {
    id: 16,
    title: "दूर जाने का दर्द",
    content: `Mt jao....
Dur hokr bhi pass rhunga...
Wada rha...
Ja rha hu...
Magar kbhi na chorr paunga...
Mujhe bhi hoti h taqlifen...
Tumhse dur hone pr...
Pr ky kru...
Ab toxic na banna chahunga
Duniya ki baaton ne majboor kr rkha h...
Woh mere pyaar ko kamjoor kr deti h...
Chahta mein bhi hu tumhe pana...
Magar fir wahi sochne ko majboor yeh krti h

Nhi jnta mein...
Aaj k zamane ka pyaar...
Jha status m dalo mohobbat...
Toh logon ko lge kamiyab...
Dikhawon m jee mein na paunga...
Ha manta hu mein...
Hu mein toxic...
Pr tumhe na kaid krna chahunga
Tumhari khushi mujh me h mein janta hu...
Is mohobbat ko meine adhoora rkha...
Iska iljaam bhi sehna chahunga.......`,
    mood: "sad",
    author: "Sushhh....🖤",
  },
  {
    id: 17,
    title: "दुआ और बद्दुआ",
    content: `Hamari dua h tumhe ki har koi mile tumhe tumhare jaisa...\nMagar baddua hamesha yhi rhegi...\nKi kbhi na mile tujhe mere jaisa...\nMile toh honge hazar tujhe chahne wale...\nJinhe tune hamesha mujhse upr darja diya h...\nMagar dekhna ek din girayenge bhi woh tujhe...\nMujhe yeh bhi ptah\n\nMohobbat ko tarsega tu bhi...\nJaise mein maut ko tarsti aai hu...\nBhulungi mein bhi ni apni jawani...\nJisse tere khatir gawai hu...\nMile tujhe woh dua h meri yeh...\nTb toh pata chale tujhe...\nKi dua di thi meine mile tujhe tere jaisa...\nAur baddua m kbhi na mile tujhe mujhe jaisa`,
    mood: "sad",
    author: "Sushhh....🖤",
  },
  {
    id: 18,
    title: "महफूज़ रखा है",
    content: `Mehfooz rakha h meine tujhe aise...\nMeri khud ki parchhai bhi na padne du tujhpe...\nJism alag ho rha h har din rooh se meri...\nTeri ek didar ko tarasti yeh aakhein h...\nMaut ko chahti hu paana...\nPr mohobbat ki tarah kambakhat woh bhi...\nTarsa rhi mujhko h....`,
    mood: "sad",
    author: "Sushhh....🖤",
  },
  {
    id: 19,
    title: "बदल गए हैं हम",
    content: `Kuch aise bane h hum...\nTere jaane k baad...\nKisi k hone pr bhi hume khud pr shaq hone laga h...\nTu banaya tune mujhe iskadar...\nKi mere sachhe alfaaz bhi jhooth mujhe lagte h...\nMeri fitrat jo na thi kbhi kisi ko ajmane ki...\nWoh ab tere jaane k baad aai h...\nHamesha dil dimaag k pehle rakha meine...\nIsliye aankhe meri 100 baar tune jhutlaih...\nM hu iss kabil tujhe barbaad krne ko...\nMagar tujhe bhulne m`,
    mood: "sad",
    author: "Sushhh....🖤",
  },
  {
    id: 20,
    title: "बड़े ख्वाब",
    content: `Mere khwab bhut bade h...\nJanti hu warna tumhe paana toh dur...\nSochna bhi mere halaton m na tha...\nMagar yeh humne apne haathon k lakeeron m...\nNi dekha ki tujhe hum pakad bhi...\nKhone ki takat rkhte h.....`,
    mood: "philosophical",
    author: "Sushhh....🖤",
  },
  {
    id: 21,
    title: "सीने से लगाया है",
    content: `Lga rkha h seene se tumhe iss tarah...\nKe ab log aarhe h tumhari jagah iss...\nKafan ko odhane...\nMohobbat m pucha unhone meri lash se...\nKi mila kya tujhe......\nMeine bhi maun shabon m kaha...\nMera rakeeb aaya h mujhe dafnane....`,
    mood: "sad",
    author: "Sushhh....🖤",
  },
  {
    id: 22,
    title: "मंजिल की राह",
    content: `Chle ho uss raah pr tum jha manjil toh milegi...\nPr sukoon bhut peeche chorr aye ho...\nSab ki parwah krte krte khud ko tumhne jo chot pahuchai h\nAb manjil bhi tumhari h jindigi ki ummid jyada Mt rkhna……`,
    mood: "philosophical",
    author: "Sushhh....🖤",
  },
  {
    id: 23,
    title: "आंखों की तलाश",
    content: `Dekho tum na sahi...\nTumahri aakhein aaj bhi mujhe dhudhti h...\nBadal toh gye tum...\nMagar uss narjron ka ky kroge jo mujhe dhudhtui har shaqs pr h ….`,
    mood: "romantic",
    author: "Sushhh....🖤",
  },
  {
    id: 24,
    title: "रब से मांगना",
    content: `Tujhe kuch iss tarah maang rhi hu...\nKi rab sochta mujhe dekh rha h\nOr mein rote hue apni jholi failaye baithi hu\nUss rab ne daala toh meri jholi m tujhe aise...\nTu hokr bhi na hua jaise`,
    mood: "romantic",
    author: "Sushhh....🖤",
  },
  {
    id: 25,
    title: "अधूरे या पूरे - दोबारा",
    content: `He - hum adhure rhengge ya pure\nShe - kyu achank ky hua tumhe\nHe - ni btao na adhure ya pure?\nShe - woh toh nhi malum mujhe...\nJitna mujhe maalum h woh h ki...\nAgar pure hue toh Shiv Parvati...\nOr agar adhure hue toh Radha Krishna...`,
    mood: "philosophical",
    author: "Sushhh....🖤",
  },
]

const moods = [
  { value: "all", label: "All Moods" },
  { value: "romantic", label: "रोमांटिक", color: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200" },
  { value: "sad", label: "उदास", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
  { value: "happy", label: "खुश", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
  {
    value: "nostalgic",
    label: "नॉस्टेल्जिक",
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  },
  {
    value: "philosophical",
    label: "दार्शनिक",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  },
  {
    value: "motivational",
    label: "प्रेरणादायक",
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  },
]

export function Dashboard() {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [shayaris, setShayaris] = useState<IShayari[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMood, setSelectedMood] = useState("all")
  const [showFavorites, setShowFavorites] = useState(false)
  const [selectedFeaturedShayari, setSelectedFeaturedShayari] = useState<(typeof featuredShayaris)[0] | null>(null)
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0)
  const [stats, setStats] = useState({
    total: 0,
    favorites: 0,
    thisMonth: 0,
  })

  const dashboardRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const featuredScrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeaturedIndex((prev) => (prev + 1) % featuredShayaris.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (featuredScrollRef.current) {
      const cardWidth = 320
      featuredScrollRef.current.scrollTo({
        left: currentFeaturedIndex * cardWidth,
        behavior: "smooth",
      })
    }
  }, [currentFeaturedIndex])

  const fetchShayaris = async () => {
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append("search", searchTerm)
      if (selectedMood && selectedMood !== "all") params.append("mood", selectedMood)
      if (showFavorites) params.append("favorite", "true")

      const response = await fetch(`/api/shayari?${params}`)
      const data = await response.json()

      if (data.success) {
        setShayaris(data.shayaris)
      } else {
        toast({
          title: "Error",
          description: "Failed to load Shayaris",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching Shayaris:", error)
      toast({
        title: "Error",
        description: "Failed to load Shayaris",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/shayari/stats")
      const data = await response.json()
      if (data.success) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  useEffect(() => {
    if (session) {
      fetchShayaris()
      fetchStats()
    }
  }, [session, searchTerm, selectedMood, showFavorites])

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/shayari/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setShayaris((prev) => prev.filter((s) => s._id !== id))
        toast({
          title: "Deleted",
          description: "Shayari deleted successfully",
        })
        fetchStats()
      } else {
        throw new Error("Failed to delete")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete Shayari",
        variant: "destructive",
      })
    }
  }

  const handleToggleFavorite = async (id: string, isFavorite: boolean) => {
    try {
      const shayari = shayaris.find((s) => s._id === id)
      if (!shayari) return

      const response = await fetch(`/api/shayari/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...shayari,
          isFavorite: !isFavorite,
        }),
      })

      if (response.ok) {
        setShayaris((prev) => prev.map((s) => (s._id === id ? { ...s, isFavorite: !isFavorite } : s)))
        fetchStats()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update favorite status",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen romantic-background floating-hearts">
      <div className="fixed inset-0 pointer-events-none z-0">
        <svg className="absolute top-10 left-10 w-16 h-16 text-primary/10" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        <svg className="absolute top-32 right-20 w-12 h-12 text-secondary/10" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 11H7v3h2v-3zm4 0h-2v3h2v-3zm4 0h-2v3h2v-3zm2-7h-1V2h-2v2H8V2H6v2H5c-1.1 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" />
        </svg>
        <svg className="absolute bottom-20 left-1/4 w-20 h-20 text-primary/5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <svg className="absolute top-1/2 right-10 w-14 h-14 text-secondary/8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        <svg
          className="absolute top-2/3 left-16 w-8 h-8 text-secondary/15 floating-heart"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
        </svg>
      </div>

      <TopShayaris />

      <main className="container mx-auto px-3 sm:px-6 py-4 sm:py-8 relative z-10">
        <div ref={dashboardRef} className="space-y-6 sm:space-y-8">
          <div className="text-center relative">
            <div className="absolute inset-0 romantic-gradient rounded-3xl blur-3xl opacity-30"></div>
            <div className="relative z-10 py-6 sm:py-8">
              <h1 className="font-playfair text-3xl sm:text-4xl md:text-6xl font-bold text-primary mb-4 shimmer-text">
                Welcome back, {session?.user?.name?.split(" ")[0]}
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8 font-source-sans px-4">
                Continue your poetic journey and explore your collection of Shayari
              </p>
              <div className="flex justify-center">
                <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-secondary pulse-heart" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <Card className="glassmorphism hover:shadow-2xl transition-all duration-500 border-2 border-primary/20 hover:border-primary/40 group">
              <CardContent className="p-6 sm:p-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-primary font-playfair mb-2">{stats.total}</h3>
                  <p className="text-muted-foreground font-semibold font-source-sans text-sm sm:text-base">
                    Total Shayaris
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="glassmorphism hover:shadow-2xl transition-all duration-500 border-2 border-secondary/20 hover:border-secondary/40 group">
              <CardContent className="p-6 sm:p-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-secondary to-secondary/80 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-white pulse-heart" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-secondary font-playfair mb-2">
                    {stats.favorites}
                  </h3>
                  <p className="text-muted-foreground font-semibold font-source-sans text-sm sm:text-base">Favorites</p>
                </div>
              </CardContent>
            </Card>

            <Card className="glassmorphism hover:shadow-2xl transition-all duration-500 border-2 border-primary/20 hover:border-primary/40 group sm:col-span-2 lg:col-span-1">
              <CardContent className="p-6 sm:p-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary via-secondary to-primary rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-primary font-playfair mb-2">{stats.thisMonth}</h3>
                  <p className="text-muted-foreground font-semibold font-source-sans text-sm sm:text-base">
                    This Month
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-4xl font-bold text-primary font-playfair flex items-center gap-3">
                <Heart className="w-8 h-8 text-secondary" />
                Featured Shayaris
              </h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-primary/30 bg-card hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
                  onClick={() =>
                    setCurrentFeaturedIndex((prev) => (prev - 1 + featuredShayaris.length) % featuredShayaris.length)
                  }
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-muted-foreground px-3 py-1 bg-card rounded-full font-medium border border-border">
                  {currentFeaturedIndex + 1} / {featuredShayaris.length}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-primary/30 bg-card hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
                  onClick={() => setCurrentFeaturedIndex((prev) => (prev + 1) % featuredShayaris.length)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div
              ref={featuredScrollRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {featuredShayaris.map((shayari, index) => (
                <Card
                  key={shayari.id}
                  className={`min-w-[300px] shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 border-2 relative overflow-hidden ${
                    index === currentFeaturedIndex ? "border-blue-500" : "border-gray-200 dark:border-gray-700"
                  }`}
                  onClick={() => setSelectedFeaturedShayari(shayari)}
                  style={{
                    backgroundImage: "url(/shayari-background.jpg)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/50 transition-all duration-300" />
                  <CardContent className="p-6 relative z-10">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-white font-playfair drop-shadow-lg shadow-black">
                          {shayari.title}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-sm font-medium backdrop-blur-sm bg-white/90 text-gray-800 shadow-lg`}
                        >
                          {moods.find((m) => m.value === shayari.mood)?.label}
                        </span>
                      </div>
                      <p className="text-white leading-relaxed font-medium line-clamp-3 drop-shadow-lg shadow-black">
                        {shayari.content.split("\n")[0]}...
                      </p>
                      <div className="flex items-center justify-between pt-2 border-t border-white/30">
                        <span className="text-sm text-white font-medium drop-shadow-lg shadow-black">
                          By {shayari.author}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-white hover:text-red-400 transition-colors backdrop-blur-sm hover:bg-white/20"
                        >
                          <Heart className="w-4 h-4 drop-shadow-lg" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Dialog open={!!selectedFeaturedShayari} onOpenChange={() => setSelectedFeaturedShayari(null)}>
            <DialogContent className="max-w-2xl max-h-[90vh] bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 flex flex-col">
              <DialogHeader className="flex-shrink-0">
                <DialogTitle className="text-2xl font-playfair text-center text-gray-900 dark:text-white">
                  {selectedFeaturedShayari?.title}
                </DialogTitle>
              </DialogHeader>
              <div className="flex-1 overflow-y-auto space-y-6 p-6">
                <div className="text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      moods.find((m) => m.value === selectedFeaturedShayari?.mood)?.color ||
                      "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                    }`}
                  >
                    {moods.find((m) => m.value === selectedFeaturedShayari?.mood)?.label}
                  </span>
                </div>
                <div className="bg-gray-50 dark:bg-slate-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600 max-h-[50vh] overflow-y-auto">
                  <p className="text-gray-900 dark:text-white leading-relaxed text-lg whitespace-pre-line text-center font-medium">
                    {selectedFeaturedShayari?.content}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">By {selectedFeaturedShayari?.author}</span>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700"
                  >
                    <Heart className="w-4 h-4" />
                    Add to Favorites
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Card className="glassmorphism shadow-xl border-2 border-primary/20">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center gap-2 sm:gap-3 text-primary font-playfair text-xl sm:text-2xl">
                <Filter className="w-5 h-5 sm:w-6 sm:h-6 text-secondary" />
                Filter & Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="relative sm:col-span-2 lg:col-span-1">
                  <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 sm:w-5 sm:h-5" />
                  <Input
                    placeholder="Search your Shayaris..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 sm:pl-12 h-10 sm:h-12 bg-card border-2 border-border hover:border-primary/30 focus:border-primary/50 transition-all duration-300 font-source-sans text-sm sm:text-base"
                  />
                </div>
                <Select value={selectedMood} onValueChange={setSelectedMood}>
                  <SelectTrigger className="h-10 sm:h-12 bg-card border-2 border-border hover:border-primary/30 focus:border-primary/50 transition-all duration-300 font-source-sans text-sm sm:text-base">
                    <SelectValue placeholder="Filter by mood" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-2 border-border">
                    {moods.map((mood) => (
                      <SelectItem key={mood.value} value={mood.value} className="font-source-sans">
                        {mood.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex gap-2 sm:gap-3 sm:col-span-2 lg:col-span-1">
                  <Button
                    variant={showFavorites ? "default" : "outline"}
                    onClick={() => setShowFavorites(!showFavorites)}
                    className="flex-1 h-10 sm:h-12 font-source-sans font-semibold transition-all duration-300 hover:scale-105 text-xs sm:text-sm"
                  >
                    <Heart className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Favorites Only</span>
                    <span className="sm:hidden">Favorites</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/calendar")}
                    className="h-10 sm:h-12 border-2 border-border hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 px-3 sm:px-4"
                  >
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2" />
                    <span className="hidden sm:inline">Calendar</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Existing shayari cards grid code */}
          <div ref={cardsRef}>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card
                    key={i}
                    className="bg-white dark:bg-slate-800 shadow-lg border border-gray-200 dark:border-gray-700"
                  >
                    <CardContent className="p-6">
                      <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                        <div className="space-y-2">
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : shayaris.length === 0 ? (
              <Card className="bg-white dark:bg-slate-800 shadow-lg text-center py-12 border border-gray-200 dark:border-gray-700">
                <CardContent>
                  <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Shayaris Found</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {searchTerm || selectedMood !== "all" || showFavorites
                      ? "Try adjusting your filters or search terms"
                      : "Start your poetic journey by creating your first Shayari"}
                  </p>
                  <Button
                    onClick={() => router.push("/editor")}
                    className="ink-drop bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Shayari
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {shayaris.map((shayari) => (
                  <ShayariCard
                    key={shayari._id}
                    shayari={shayari}
                    onDelete={handleDelete}
                    onToggleFavorite={handleToggleFavorite}
                    className="shayari-card"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
