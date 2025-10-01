import { useState, useEffect } from 'react'
import { VideoPlayer } from '../lessons/VideoPlayer'
import { QuizInterface } from '../quiz/QuizInterface'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Progress } from '../ui/progress'
import { Separator } from '../ui/separator'
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  CheckCircle,
  BookOpen,
  Trophy,
  Clock
} from 'lucide-react'
import { api } from '../../services/api'
import { getDummyCourseById } from '../../utils/dummyData'
import type { Course, Lesson, Progress as ProgressType, QuizResult } from '../../types'

interface CourseViewerProps {
  courseId: string
  onBack: () => void
}

export function CourseViewer({ courseId, onBack }: CourseViewerProps) {
  const [course, setCourse] = useState<Course | null>(null)
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0)
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0)
  const [progress, setProgress] = useState<ProgressType | null>(null)
  const [lessonProgress, setLessonProgress] = useState(0)
  const [loading, setLoading] = useState(true)
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English')

  // Official South African languages
  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans' },
    { code: 'zu', name: 'Zulu', nativeName: 'IsiZulu' },
    { code: 'xh', name: 'Xhosa', nativeName: 'IsiXhosa' },
    { code: 'st', name: 'Sesotho', nativeName: 'Sesotho' },
    { code: 'tn', name: 'Setswana', nativeName: 'Setswana' },
    { code: 'ss', name: 'Swati', nativeName: 'SiSwati' },
    { code: 'nr', name: 'Ndebele', nativeName: 'IsiNdebele' },
    { code: 'nso', name: 'Sepedi', nativeName: 'Sepedi' },
    { code: 've', name: 'Venda', nativeName: 'Tshivenda' },
    { code: 'ts', name: 'Tsonga', nativeName: 'Xitsonga' }
  ]

  // Load from dummy data to simulate backend

  useEffect(() => {
    loadCourse()
    loadProgress()
  }, [courseId])

  const loadCourse = async () => {
    try {
      const data = getDummyCourseById(courseId)
      setCourse(data)
    } catch (error) {
      console.error('Failed to load course:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadProgress = async () => {
    try {
      const progressData = await api.getProgress(courseId)
      setProgress(progressData)
    } catch (error) {
      console.error('Failed to load progress:', error)
      // Initialize with empty progress if loading fails
      setProgress({
        courseId,
        userId: '',
        completedLessons: [],
        overallProgress: 0,
        timeSpent: 0
      })
    }
  }

  const getCurrentLesson = (): Lesson | null => {
    if (!course) return null
    return course.modules[currentModuleIndex]?.lessons[currentLessonIndex] || null
  }

  const getTotalLessons = (): number => {
    if (!course) return 0
    return course.modules.reduce((sum, module) => sum + module.lessons.length, 0)
  }

  const getOverallProgress = (): number => {
    if (!course || !progress) return 0
    
    const totalLessons = getTotalLessons()
    const completedLessons = progress.completedLessons.length
    
    // Calculate progress based on completed lessons + current lesson progress
    let totalProgress = completedLessons * 100 // Each completed lesson = 100%
    
    // Add current lesson progress if it's not completed
    const currentLessonId = getCurrentLesson()?.id
    if (currentLessonId && !progress.completedLessons.includes(currentLessonId)) {
      totalProgress += lessonProgress
    }
    
    return Math.min(100, totalProgress / totalLessons)
  }

  const getCurrentLessonNumber = (): number => {
    if (!course) return 0
    let count = 0
    for (let i = 0; i < currentModuleIndex; i++) {
      count += course.modules[i].lessons.length
    }
    return count + currentLessonIndex + 1
  }

  // Get content based on selected language
  const getLocalizedContent = (content: string, language: string): string => {
    // Comprehensive translations for lesson content
    const translations: Record<string, Record<string, string>> = {
      'Introduction and Definition: Artificial Insemination (AI) is a reproductive technology where sperm is collected, processed, and manually introduced into the female reproductive tract to achieve fertilization without natural mating. It is widely used in agriculture and human medicine and has transformed breeding practices across species. Why Study AI? Agricultural impact (rapid spread of superior genetics), medical applications (overcoming fertility challenges), scientific understanding (reproductive biology and genetics), and economic importance (significant value in agriculture and medicine).\n\nReproductive Biology Fundamentals (Female): Overview of the ovaries, oviducts (fallopian tubes), uterus, cervix, and vagina in relation to AI success. Emphasis on estrus detection, ovulation timing, and creating optimal conditions for fertilization.': {
        'Afrikaans': 'Inleiding en Definisie: Kunsmatige Inseminasie (AI) is \'n voortplantingstegnologie waar sperma versamel, verwerk en handmatig in die vroulike voortplantingskanaal ingebring word om bevrugting sonder natuurlike paring te bewerkstellig. Dit word wyd gebruik in landbou en menslike medisyne en het teelpraktieke oor spesies heen getransformeer. Hoekom AI bestudeer? Landbouimpak (vinnige verspreiding van superieure genetika), mediese toepassings (oorwinning van vrugbaarheidsuitdagings), wetenskaplike begrip (voortplantingsbiologie en genetika), en ekonomiese belangrikheid (beduidende waarde in landbou en medisyne).\n\nVoortplantingsbiologie Grondbeginsels (Vroulik): Oorsig van die eierstokke, eileiers (fallopian tubes), baarmoeder, serviks, en vagina in verhouding tot AI sukses. Klem op estrus opsporing, ovulasie tydsberekening, en die skep van optimale toestande vir bevrugting.',
        'IsiZulu': 'Isingeniso Nencazelo: Ukufakwa Kwesidoda Ngamakhono (AI) ubuchwepheshe bokuzala lapho isidoda siqoqwa, sincibilikiswe, futhi singenwe ngesandla emgogodini wokuzala wesifazane ukuze kufezwe ukukhulelwa ngaphandle kokusondelana kwemvelo. Kuyasetshenziswa kakhulu ezolimo nasezokwelapha kwabantu futhi kuguqule izindlela zokuzala kuzo zonke izinhlobo. Kungani kufanele kufundwe i-AI? Umthelela wezolimo (ukusabalala okusheshayo kwezakhi zofuzo eziphambili), ukusetshenziswa kwezokwelapha (ukunqoba izinselele zokukhulelwa), ukuqonda kwesayensi (ibhayoloji yokuzala kanye nezakhi zofuzo), nokubaluleka kwezomnotho (inani elibalulekile ezolimo nasezokwelapha).\n\nImigomo Eyisiseko Ye-Bhayoloji Yokuzala (Isifazane): Ukubuka okubanzi kwe-ovaries, ama-oviducts (fallopian tubes), i-uterus, i-cervix, kanye ne-vagina maqondana nempumelelo ye-AI. Ugcizelelo ekutholweni kwe-estrus, isikhathi sokuvuza, nokudala izimo ezifanele zokukhulelwa.',
        'IsiXhosa': 'Intshayelelo Nencazelo: Ukufakwa Kwesidoda Ngamakhono (AI) bubuchwepheshe bokuzala apho isidoda siqoqwa, sincibilikiswe, kwaye singenwa ngesandla kwindawo yokuzala yesifazane ukuze kufezwe ukukhulelwa ngaphandle kokusondelana kwemvelo. Kuyasetshenziswa kakhulu ezolimo nasezokwelapha kwabantu kwaye kuguqule izindlela zokuzala kuzo zonke iintlobo. Kutheni kufuneka kufundwe i-AI? Umthelela wezolimo (ukusabalala okukhawulezayo kwezakhi zofuzo eziphambili), ukusetyenziswa kwezokwelapha (ukunqoba iziphene zokukhulelwa), ukuqonda kwesayensi (ibhayoloji yokuzala kunye nezakhi zofuzo), nokubaluleka kwezomnotho (inxalenye ebalulekileyo ezolimo nasezokwelapha).\n\nImigomo Eyisiseko Ye-Bhayoloji Yokuzala (Isifazane): Ukubuka okubanzi kwe-ovaries, ama-oviducts (fallopian tubes), i-uterus, i-cervix, kunye ne-vagina maqondana nempumelelo ye-AI. Ugcizelelo ekufunyanweni kwe-estrus, ixesha lokuvuza, nokudala iimeko ezifaneleyo zokukhulelwa.',
        'Sesotho': 'Tsenolo le Tlhaloso: Ho Kenngwa ha Tshebe ka Boiteko (AI) ke theknoloji ea ho tsoala moo tshebe e bokelloang, e sebetsang, le ho kenngoa ka matsoho moo ho tsoalang oa basali ho fihlella ho tsoala ntle le ho kopana ha tlhaho. E sebelisoa hohle temong le bongakeng ba batho mme e fetotse mekhoa ea ho tsoala mefuteng eohle. Ke hobane\'ng ho tlameha ho ithutoa AI? Kameho ea temo (phetisetso e potlakileng ea li-genetics tse phahameng), tsebeliso ea bongaka (ho hlola mathata a ho tsoala), kutlwisiso ea saense (batho ba tsoalo le genetics), le bohlokoa ba moruo (bohlokoa bo bongata temong le bongakeng).\n\nMelao ea Bohlokoa ea Biology ea Ho Tsoala (Basali): Tlhaloso ea ovaries, oviducts (fallopian tubes), uterus, cervix, le vagina maqobong le katleho ea AI. Khethelo ho fumana estrus, nako ea ho tsoala, le ho theha maemo a lokelang a ho tsoala.',
        'Setswana': 'Tsenolo le Tlhaloso: Go Tsenngwa ga Tshebe ka Boikanyego (AI) ke theknoloji ya go tsoala mo tshebe e bokelwang, e dirisiwang, le go tsenngwa ka diatla moo go tsoalang ga basadi go fihlela go tsoala ntle le go kopana ga tlhago. E dirisiwa kudu mo temong le bongakeng ba batho mme e fetotse mekgwa ya go tsoala mefuta yohle. Ke ka ntlha yang fa re tlamega go ithuta AI? Kameho ya temo (phetisetso e e potlakileng ya li-genetics tse di phahameng), tsebeliso ya bongaka (go fenya mathata a go tsoala), kutlwisiso ya saense (batho ba tsoalo le genetics), le botlhokwa jwa moruo (boleng jo bo bongata temong le bongakeng).\n\nMelao ya Botlhokwa ya Biology ya Go Tsoala (Basadi): Tlhaloso ya ovaries, oviducts (fallopian tubes), uterus, cervix, le vagina maqobong le katlego ya AI. Kgethego go fitlhelela estrus, nako ya go tsoala, le go thea maemo a a siameng a go tsoala.',
        'SiSwati': 'Singeniso Nencazelo: Ukufakwa Kwesidoda Ngemakhono (AI) bubuchwepheshe bokuzala lapho isidoda siqoqwa, sincibilikiswe, futsi singenwe ngesandla emgogodini wokuzala wesifati ukuze kufezwe ukukhulelwa ngaphandle kokusondelana kwemvelo. Kuyasetshenziswa kakhulu ezolimo nasezokwelapha kwabantu futsi kuguqule tindlela tokuzala kuzo zonke tinhlobo. Kungani kufanele kufundwe i-AI? Umthelela wezolimo (ukusabalala lokusheshayo kwezakhi zofuzo letiphambili), kusetjentiswa kwezokwelapha (kunqoba tinkinga tekukhulelwa), kutisisa kwesayensi (i-bhayoloji yekuzala kanye nezakhi zofuzo), nekubaluleka kwemnotfo (inani lelibalulekile ezolimo nasezokwelapha).\n\nImigomo Leyisiseko Ye-Bhayoloji Yekuzala (Sifati): Kubuka lokubanzi kwe-ovaries, ema-oviducts (fallopian tubes), i-uterus, i-cervix, kanye ne-vagina maqondana nempumelelo ye-AI. Ugcizelelo ekutfoleni estrus, sikhatsi sekutsoala, nekudala ticondziso letifanele tekukhulelwa.',
        'IsiNdebele': 'Isingeniso Nencazelo: Ukufakwa Kwesidoda Ngamakhono (AI) ubuchwepheshe bokuzala lapho isidoda siqoqwa, sincibilikiswe, futhi singenwe ngesandla emgogodini wokuzala wesifazane ukuze kufezwe ukukhulelwa ngaphandle kokusondelana kwemvelo. Kuyasetshenziswa kakhulu ezolimo nasezokwelapha kwabantu futhi kuguqule izindlela zokuzala kuzo zonke izinhlobo. Kungani kufanele kufundwe i-AI? Umthelela wezolimo (ukusabalala okusheshayo kwezakhi zofuzo eziphambili), ukusetshenziswa kwezokwelapha (ukunqoba izinselele zokukhulelwa), ukuqonda kwesayensi (ibhayoloji yokuzala kanye nezakhi zofuzo), nokubaluleka kwezomnotho (inani elibalulekile ezolimo nasezokwelapha).\n\nImigomo Eyisiseko Ye-Bhayoloji Yokuzala (Isifazane): Ukubuka okubanzi kwe-ovaries, ama-oviducts (fallopian tubes), i-uterus, i-cervix, kanye ne-vagina maqondana nempumelelo ye-AI. Ugcizelelo ekutholweni kwe-estrus, isikhathi sokuvuza, nokudala izimo ezifanele zokukhulelwa.',
        'Sepedi': 'Tsenolo le Tlhaloso: Go Tsenngwa ga Tshebe ka Boikanyego (AI) ke theknoloji ya go tsoala mo tshebe e bokelwang, e dirisiwang, le go tsenngwa ka diatla moo go tsoalang ga basadi go fihlela go tsoala ntle le go kopana ga tlhago. E dirisiwa kudu mo temong le bongakeng ba batho mme e fetotse mekgwa ya go tsoala mefuta yohle. Ke ka ntlha yang fa re tlamega go ithuta AI? Kameho ya temo (phetisetso e e potlakileng ya li-genetics tse di phahameng), tsebeliso ya bongaka (go fenya mathata a go tsoala), kutlwisiso ya saense (batho ba tsoalo le genetics), le botlhokwa jwa moruo (boleng jo bo bongata temong le bongakeng).\n\nMelao ya Botlhokwa ya Biology ya Go Tsoala (Basadi): Tlhaloso ya ovaries, oviducts (fallopian tubes), uterus, cervix, le vagina maqobong le katlego ya AI. Kgethego go fitlhelela estrus, nako ya go tsoala, le go thea maemo a a siameng a go tsoala.',
        'Tshivenda': 'Tshanduko na Tshaluso: U Tsenngwa ha Tshebe nga Mulimo (AI) ndi theknoloji ya u tsoala nga ha tshebe i bvumbiwa, i shumiswa, na u tsenngwa nga maanḓa kha nda ya u tsoala ya munna u ṱuṱuwedza u tsoala hu si na u pfana ha vhukuma. I shumiswa vhukuma temoni na bongakeng ha vhathu na i fetola ndila dza u tsoala zwihulwane zwoṱhe. Ndi ngani ri fanela u guda AI? Tshivhulungo tsha temo (u phetisetso ha vhukuma ha li-genetics dza vhukuma), tshumelo dza bongaka (u fhula mathata a u tsoala), u pfesesa ha saense (batho ba tsoala na genetics), na vhukuma ha moruo (vhukuma ha vhukuma temoni na bongakeng).\n\nMilayo ya Vhukuma ya Biology ya u Tsoala (Vhafumakadzi): Tshidzuluso ya ovaries, oviducts (fallopian tubes), uterus, cervix, na vagina maqobong na katleho ya AI. Khetheho u wana estrus, nga u tsoala, na u vhumba maitele a a si na a u tsoala.',
        'Xitsonga': 'Mavumbi ni Nhlaluso: Ku Tsenngwa ka Tshebe hi Vukorhokeri (AI) i theknoloji ya ku tsoala loko tshebe yi bumbiwa, yi tirhisiwa, na ku tsenngwa hi matimba eka ndhawu ya ku tsoala ya wansati ku fikelela ku tsoala ku nga ri na ku hlangana ka ntumbuluko. Yi tirhisiwa swinene ematikweni ni bongakeng bya vanhu na yi cinca mintirho ya ku tsoala swihlovo hinkwaswo. Hi yini hi fanele ku dyondza AI? Vukorhokeri bya misava (ku hangalaka ka vukorhokeri bya genetics lebyi phakamaka), matirhisa ya bongakeng (ku tlula switlhontlho swa ku tsoala), ku twisisa ka sayense (batho ba tsoala na genetics), na vukorhokeri bya ndhavuko (vukorhokeri lebyi kulekaka misavani na bongakeng).\n\nMilawu ya Vukorhokeri bya Biology ya ku Tsoala (Wansati): Ku vumbeka ka ovaries, oviducts (fallopian tubes), uterus, cervix, ni vagina maqobong ni mpumelelo wa AI. Ku kambela ku kuma estrus, nkarhi wa ku tsoala, ni ku vumbela mintlangu ya vukorhokeri ya ku tsoala.'
      },
      'Why Study AI? Agricultural impact (rapid spread of superior genetics), medical applications (overcoming fertility challenges), scientific understanding (reproductive biology and genetics), and economic importance (significant value in agriculture and medicine).': {
        'Afrikaans': 'Hoekom AI bestudeer? Landbouimpak (vinnige verspreiding van superieure genetika), mediese toepassings (oorwinning van vrugbaarheidsuitdagings), wetenskaplike begrip (voortplantingsbiologie en genetika), en ekonomiese belangrikheid (beduidende waarde in landbou en medisyne).',
        'IsiZulu': 'Kungani kufanele kufundwe i-AI? Umthelela wezolimo (ukusabalala okusheshayo kwezakhi zofuzo eziphambili), ukusetshenziswa kwezokwelapha (ukunqoba izinselele zokukhulelwa), ukuqonda kwesayensi (ibhayoloji yokuzala kanye nezakhi zofuzo), nokubaluleka kwezomnotho (inani elibalulekile ezolimo nasezokwelapha).',
        'IsiXhosa': 'Kutheni kufuneka kufundwe i-AI? Umthelela wezolimo (ukusabalala okukhawulezayo kwezakhi zofuzo eziphambili), ukusetyenziswa kwezokwelapha (ukunqoba iziphene zokukhulelwa), ukuqonda kwesayensi (ibhayoloji yokuzala kunye nezakhi zofuzo), nokubaluleka kwezomnotho (inxalenye ebalulekileyo ezolimo nasezokwelapha).',
        'Sesotho': 'Ke hobane\'ng ho tlameha ho ithutoa AI? Kameho ea temo (phetisetso e potlakileng ea li-genetics tse phahameng), tsebeliso ea bongaka (ho hlola mathata a ho tsoala), kutlwisiso ea saense (batho ba tsoalo le genetics), le bohlokoa ba moruo (bohlokoa bo bongata temong le bongakeng).',
        'Setswana': 'Ke ka ntlha yang fa re tlamega go ithuta AI? Kameho ya temo (phetisetso e e potlakileng ya li-genetics tse di phahameng), tsebeliso ya bongaka (go fenya mathata a go tsoala), kutlwisiso ya saense (batho ba tsoalo le genetics), le botlhokwa jwa moruo (boleng jo bo bongata temong le bongakeng).',
        'SiSwati': 'Kungani kufanele kufundwe i-AI? Umthelela wezolimo (ukusabalala lokusheshayo kwezakhi zofuzo letiphambili), kusetjentiswa kwezokwelapha (kunqoba tinkinga tekukhulelwa), kutisisa kwesayensi (i-bhayoloji yekuzala kanye nezakhi zofuzo), nekubaluleka kwemnotfo (inani lelibalulekile ezolimo nasezokwelapha).',
        'IsiNdebele': 'Kungani kufanele kufundwe i-AI? Umthelela wezolimo (ukusabalala okusheshayo kwezakhi zofuzo eziphambili), ukusetshenziswa kwezokwelapha (ukunqoba izinselele zokukhulelwa), ukuqonda kwesayensi (ibhayoloji yokuzala kanye nezakhi zofuzo), nokubaluleka kwezomnotho (inani elibalulekile ezolimo nasezokwelapha).',
        'Sepedi': 'Ke ka ntlha yang fa re tlamega go ithuta AI? Kameho ya temo (phetisetso e e potlakileng ya li-genetics tse di phahameng), tsebeliso ya bongaka (go fenya mathata a go tsoala), kutlwisiso ya saense (batho ba tsoala le genetics), le botlhokwa jwa moruo (boleng jo bo bongata temong le bongakeng).',
        'Tshivenda': 'Ndi ngani ri fanela u guda AI? Tshivhulungo tsha temo (u phetisetso ha vhukuma ha li-genetics dza vhukuma), tshumelo dza bongaka (u fhula mathata a u tsoala), u pfesesa ha saense (batho ba tsoala na genetics), na vhukuma ha moruo (vhukuma ha vhukuma temoni na bongakeng).',
        'Xitsonga': 'Hi yini hi fanele ku dyondza AI? Vukorhokeri bya misava (ku hangalaka ka vukorhokeri bya genetics lebyi phakamaka), matirhisa ya bongakeng (ku tlula switlhontlho swa ku tsoala), ku twisisa ka sayense (batho ba tsoala na genetics), na vukorhokeri bya ndhavuko (vukorhokeri lebyi kulekaka misavani na bongakeng).'
      },
      '## Basic Principles of AI\n\nArtificial Insemination follows several fundamental principles that ensure successful reproduction:\n\n- **Sperm Collection**: High-quality sperm is collected from healthy males\n- **Sperm Processing**: Collected sperm is processed to maintain viability\n- **Insemination Technique**: Proper technique ensures optimal placement\n- **Timing**: Insemination must occur during the female\'s fertile period': {
        'Afrikaans': '## Basiese Beginsels van AI\n\nKunsmatige Inseminasie volg verskeie fundamentele beginsels wat suksesvolle voortplanting verseker:\n\n- **Sperma Versameling**: Hoë-kwaliteit sperma word van gesonde manlike diere versamel\n- **Sperma Verwerking**: Versamelde sperma word verwerk om lewensvatbaarheid te handhaaf\n- **Inseminasie Tegniek**: Behoorlike tegniek verseker optimale plasing\n- **Tydberekening**: Inseminasie moet plaasvind tydens die vroulike dier se vrugbare periode',
        'IsiZulu': '## Imigomo Eyisiseko ye-AI\n\nUkufakwa Kwesidoda Ngamakhono kulandela imigomo eminingana eyisiseko eqinisekisa ukuzala okunempumelelo:\n\n- **Ukuqoqwa Kwesidoda**: Isidoda esisezingeni eliphakeme siqoqwa ezinsikazi ezilungile\n- **Ukucubungulwa Kwesidoda**: Isidoda esiqoqwe sicubungulwa ukuze sigcine ukusebenza\n- **Indlela Yokufakwa**: Indlela efanele iqinisekisa ukubeka okuphelele\n- **Isikhathi**: Ukufakwa kumele kwenzeke ngesikhathi sokuzala kwesifazane',
        'IsiXhosa': '## Imigaqo Eyisiseko ye-AI\n\nUkufakwa Kwesidoda Ngamakhono kulandela imigaqo emininzi eyisiseko eqinisekisa ukuzala okunempumelelo:\n\n- **Ukuqokelelwa Kwesidoda**: Isidoda esisezingeni eliphakeme siqokelelwa kwizilwanyana ezilungileyo\n- **Ukucubungulwa Kwesidoda**: Isidoda esiqokelelweyo sicubungulwa ukuze sigcine ukusebenza\n- **Indlela Yokufakwa**: Indlela efaneleyo iqinisekisa ukubeka okupheleleyo\n- **Ixesha**: Ukufakwa kufuneka kwenzeke ngexesha lokuzala lwesifazane',
        'Sesotho': '## Melao ea Bohlokoa ea AI\n\nHo Kenngwa ha Tshebe ka Boiteko ho latela melao e mengata ea bohlokoa e netefatsang ho tsoala ha katleho:\n\n- **Pokello ea Tshebe**: Tshebe e boleng bo boholo e bokelloa ho batho ba bohlale\n- **Tshebetso ea Tshebe**: Tshebe e bokelloang e sebetsa ho boloka bokhoni\n- **Mokhoa oa Ho Kenngwa**: Mokhoa o lokelang o netefatsa ho behoa ha hantle\n- **Nako**: Ho kenngwa ho tlameha ho etsahala ka nako ea ho tsoala ea mosali',
        'Setswana': '## Melao ya Botlhokwa ya AI\n\nGo Tsenngwa ga Tshebe ka Boikanyego go latela melao e mengata ya botlhokwa e e netefatsang go tsoala ga katleho:\n\n- **Pokanyo ya Tshebe**: Tshebe e boleng jo bo bogolo e bokelwa mo bathong ba bohlale\n- **Tiro ya Tshebe**: Tshebe e e bokilweng e dirisiwa go boloka bokgoni\n- **Mokgwa wa Go Tsenngwa**: Mokgwa o o siameng o netefatsa go bewa ga botlhokwa\n- **Nako**: Go tsenngwa go tlamega go diragala ka nako ya go tsoala ya mosadi',
        'SiSwati': '## Imigomo Leyisiseko ye-AI\n\nUkufakwa Kwesidoda Ngemakhono kulandzela imigomo leminingi leyisiseko lecinisekisa kuzala lokunempumelelo:\n\n- **Kubumbiwa Kwesidoda**: Sidoda lesisezingeni leliphakeme siqoqwa etinsikazini letilungile\n- **Kucubungulwa Kwesidoda**: Sidoda lesiqoqwe sicubungulwa ukuze sigcine kusebenta\n- **Indlela Yekufakwa**: Indlela lefanele icinisekisa kubeka lokuphelele\n- **Sikhatsi**: Kufakwa kufanele kwenteke ngesikhatsi sekuzala kwesifati',
        'IsiNdebele': '## Imigomo Eyisiseko ye-AI\n\nUkufakwa Kwesidoda Ngamakhono kulandela imigomo eminingana eyisiseko eqinisekisa ukuzala okunempumelelo:\n\n- **Ukuqoqwa Kwesidoda**: Isidoda esisezingeni eliphakeme siqoqwa ezinsikazi ezilungile\n- **Ukucubungulwa Kwesidoda**: Isidoda esiqoqwe sicubungulwa ukuze sigcine ukusebenza\n- **Indlela Yokufakwa**: Indlela efanele iqinisekisa ukubeka okuphelele\n- **Isikhathi**: Ukufakwa kumele kwenzeke ngesikhathi sokuzala kwesifazane',
        'Sepedi': '## Melao ya Botlhokwa ya AI\n\nGo Tsenngwa ga Tshebe ka Boikanyego go latela melao e mengata ya botlhokwa e e netefatsang go tsoala ga katleho:\n\n- **Pokanyo ya Tshebe**: Tshebe e boleng jo bo bogolo e bokelwa mo bathong ba bohlale\n- **Tiro ya Tshebe**: Tshebe e e bokilweng e dirisiwa go boloka bokgoni\n- **Mokgwa wa Go Tsenngwa**: Mokgwa o o siameng o netefatsa go bewa ga botlhokwa\n- **Nako**: Go tsenngwa go tlamega go diragala ka nako ya go tsoala ya mosadi',
        'Tshivenda': '## Milayo ya Vhukuma ya AI\n\nU Tsenngwa ha Tshebe nga Mulimo hu tevhedza milayo minzhi ya vhukuma i ḓivhadza u tsoala ha vhukuma:\n\n- **U Bvumbiwa ha Tshebe**: Tshebe ya vhukuma ya bvumbiwa kha vhanna vha vhukuma\n- **U Shumiswa ha Tshebe**: Tshebe ya bvumbiwa i shumiswa u ḓivhadza u shuma\n- **Nḓila ya u Tsenngwa**: Nḓila ya vhukuma i ḓivhadza u bvela ha vhukuma\n- **Nga**: U tsenngwa hu fanela u ita nga nga u tsoala ha munna',
        'Xitsonga': '## Milawu ya Vukorhokeri bya AI\n\nKu Tsenngwa ka Tshebe hi Vukorhokeri ku landzelela milawu leminzhi ya vukorhokeri leyi tiyisekisaka ku tsoala ka vukorhokeri:\n\n- **Ku Bumbiwa ka Tshebe**: Tshebe ya vukorhokeri yi bumbiwa eka vanuna va vukorhokeri\n- **Ku Tirhisiwa ka Tshebe**: Tshebe leyi bumbiweke yi tirhisiwa ku tiyisekisa ku tirha\n- **Ndlela ya ku Tsenngwa**: Ndlela ya vukorhokeri yi tiyisekisa ku tshika ka vukorhokeri\n- **Nkarhi**: Ku tsenngwa swi fanele swi endleka hi nkarhi wa ku tsoala wa wansati'
      },
      'Scientific Principles and Preparation: Fertilization steps—sperm transport, capacitation, binding and penetration of the egg, and zygote formation. Timing considerations: estrus detection, ovulation timing, and sperm viability. Genetic principles: heritability, breeding value, genetic diversity, and avoiding inbreeding.\n\nPreparation and hygiene focus: minimizing contamination, correct equipment handling, maintaining biosecurity, and SOPs that improve success rates.': {
        'Afrikaans': 'Wetenskaplike Beginsels en Voorbereiding: Bevrugting stappe—sperma vervoer, kapasitasie, binding en penetrasie van die eier, en zigoot vorming. Tydberekening oorwegings: estrus opsporing, ovulasie tydsberekening, en sperma lewensvatbaarheid. Genetiese beginsels: oorerflikheid, teel waarde, genetiese diversiteit, en vermy van inteling.\n\nVoorbereiding en higiëne fokus: minimalisering van kontaminasie, korrekte toerusting hantering, handhawing van biosekuriteit, en SOPs wat sukseskoerse verbeter.',
        'IsiZulu': 'Imigomo Yesayensi Nokulungiselela: Izinyathelo zokukhulelwa—ukuthuthwa kwesidoda, ukugcwaliseka, ukubopha nokungena kwesidoda kuqanda, nokwakheka kwe-zygote. Ukucabangela isikhathi: ukutholwa kwe-estrus, isikhathi sokuvuza, nokusebenza kwesidoda. Imigomo yezakhi zofuzo: ukuzalwa, inani lokuzalisa, ukwehluka kwezakhi zofuzo, nokugwema ukuzalana kwakusodongeni.\n\nUkugxila ekulungiselelweni nasekuhlanzweni: ukunciphisa ukungcoliswa, ukuphatha izinto ezifanele, ukugcina ukuvikeleka kwempilo, namakhono okuthuthukisa amaphuzu empumelelo.',
        'IsiXhosa': 'Imigaqo Yesayensi Nokulungiselela: Amanyathelo okukhulelwa—ukuthuthwa kwesidoda, ukugcwaliseka, ukubopha nokungena kwesidoda kuqanda, nokwakheka kwe-zygote. Ukucabangela ixesha: ukufunyanwa kwe-estrus, ixesha lokuvuza, nokusebenza kwesidoda. Imigaqo yezakhi zofuzo: ukuzalwa, ixabiso lokuzalisa, ukwahluka kwezakhi zofuzo, nokugwema ukuzalana kwakusodongeni.\n\nUkugxila ekulungiselelweni nasekuhlanzweni: ukunciphisa ukungcoliswa, ukuphatha izinto ezifaneleyo, ukugcina ukuvikeleka kwempilo, namakhono okuthuthukisa amaphuzu empumelelo.',
        'Sesotho': 'Melao ea Saense le Tlhabollo: Mehato ea ho tsoala—ho tsamaisa tshebe, ho lokisa, ho bopa le ho kena ha tshebe leqeng, le ho thehoa ha zygote. Ho nahana ka nako: ho fumana estrus, nako ea ho tsoala, le bokhoni ba tshebe. Melao ea genetics: ho tsoala, boleng ba ho tsoala, phapano ea genetics, le ho qoba ho tsoala ka har\'a ba tsoanang.\n\nHo tsepama tlhabollong le hlambong: ho fokotsa ho tsoa kae, ho sebetsana le lisebelisoa ka nepo, ho boloka tshireletso ea bophelo, le maano a ntlafatsang katleho.',
        'Setswana': 'Melao ya Saense le Tlhagiso: Mehato ya go tsoala—go tsamaisa tshebe, go lokisa, go bopa le go tsena ga tshebe leqeng, le go thehoa ga zygote. Go akanya ka nako: go fitlhelela estrus, nako ya go tsoala, le bokgoni jwa tshebe. Melao ya genetics: go tsoala, boleng jwa go tsoala, pharologano ya genetics, le go fologela go tsoala ka gare ga ba tshwana.\n\nGo tsepama tlhagisong le tlhatlhobong: go fokotsa go tsoa kae, go sebetsana le didirisiwa ka nepo, go boloka tshireletso ya botshelo, le maano a ntlafatsang katleho.',
        'SiSwati': 'Imigomo Yesayensi Nekulungiselela: Tinyathelo tekukhulelwa—kutsamaisa sidoda, kugcwaliseka, kubopa nekungena kwesidoda liqanda, nekutakhiwa kwe-zygote. Kucabanga ngesikhatsi: kutfola estrus, sikhatsi sekutsoala, nekutsebenta kwesidoda. Imigomo ye-genetics: kutsoala, inani lekutsoala, kwehlukana kwe-genetics, nekugwema kutsoala phakatsi kwabo tshwana.\n\nKugxila ekulungiselelweni nekuhlanzweni: kunciphisa kungcoliseka, kuphatsa tintfo letifanele, kugcina tivikelelo tebuhlanga, nemakhono lokutfutfukisa emaphuzu empumelelo.',
        'IsiNdebele': 'Imigomo Yesayensi Nokulungiselela: Izinyathelo zokukhulelwa—ukuthuthwa kwesidoda, ukugcwaliseka, ukubopha nokungena kwesidoda kuqanda, nokwakheka kwe-zygote. Ukucabangela isikhathi: ukutholwa kwe-estrus, isikhathi sokuvuza, nokusebenza kwesidoda. Imigomo yezakhi zofuzo: ukuzalwa, inani lokuzalisa, ukwehluka kwezakhi zofuzo, nokugwema ukuzalana kwakusodongeni.\n\nUkugxila ekulungiselelweni nasekuhlanzweni: ukunciphisa ukungcoliswa, ukuphatha izinto ezifanele, ukugcina ukuvikeleka kwempilo, namakhono okuthuthukisa amaphuzu empumelelo.',
        'Sepedi': 'Melao ya Saense le Tlhagiso: Mehato ya go tsoala—go tsamaisa tshebe, go lokisa, go bopa le go tsena ga tshebe leqeng, le go thehoa ga zygote. Go akanya ka nako: go fitlhelela estrus, nako ya go tsoala, le bokgoni jwa tshebe. Melao ya genetics: go tsoala, boleng jwa go tsoala, pharologano ya genetics, le go fologela go tsoala ka gare ga ba tshwana.\n\nGo tsepama tlhagisong le tlhatlhobong: go fokotsa go tsoa kae, go sebetsana le didirisiwa ka nepo, go boloka tshireletso ya botshelo, le maano a ntlafatsang katleho.',
        'Tshivenda': 'Milayo ya Saense na Tshidzulo: Mitevhe ya u tsoala—u tsamaisa tshebe, u lugisela, u bumba na u tsennga tshebe kha ḽiṅa, na u takhiwa ha zygote. U ḓivhisa nga: u wana estrus, nga u tsoala, na u shuma ha tshebe. Milayo ya genetics: u tsoala, vhukuma ha u tsoala, pharolano ya genetics, na u ḓivhadza u tsoala nga ha vhanna vha tshimbidzana.\n\nU tsepama tshidzuloni na tshilamboni: u fhungudza u ḓiwa nga ha, u shumisana na zwishumiswa nga u todi, u ḓivhadza tshirindzi tsha mveledziso, na maitele a u fhufhadza zwibveledzwa.',
        'Xitsonga': 'Milawu ya Sayense ni Ku Lungiselela: Mintirho ya ku tsoala—ku tsamaisa tshebe, ku lokisa, ku bopa ni ku tsennga tshebe enhlokweni, ni ku vumbiwa ka zygote. Ku akanya hi nkarhi: ku kuma estrus, nkarhi wa ku tsoala, ni ku tirha ka tshebe. Milawu ya genetics: ku tsoala, vukorhokeri bya ku tsoala, ku hambana ka genetics, ni ku pfumala ku tsoala ka gare ka va tshimbana.\n\nKu tsepama eka ku lungiselelweni ni ku hlambulukeni: ku fokota ku tswa ka ha, ku tirhisa swishumiswa hi ndlela yo fanele, ku tiyisekisa tshireletso ya ntumbuluko, ni maendlelo ya ku pfukisa matimba ya mpumelelo.'
      },
      'The AI Process Step-by-Step:\nPhase 1 – Semen Collection: artificial vagina, electroejaculation, manual methods (species-dependent); quality assessment of volume, concentration, motility, morphology.\nPhase 2 – Semen Processing: evaluation, dilution with extenders, cooling, addition of cryoprotectants, packaging in straws, freezing in liquid nitrogen (−196°C).\nPhase 3 – Female Preparation: estrus synchronization, health screening, nutrition.\nPhase 4 – Insemination Procedure: thawing, loading devices, insertion, deposition at the optimal site (cervix/uterus/oviducts by technique), and documentation.\nPhase 5 – Follow-up: pregnancy detection, record keeping, and ongoing health monitoring.': {
        'Afrikaans': 'Die AI Proses Stap-vir-Stap:\nFase 1 – Sperma Versameling: kunsmatige vagina, elektroejakulasie, handmatige metodes (spesie-afhanklik); kwaliteit assessering van volume, konsentrasie, motiliteit, morfologie.\nFase 2 – Sperma Verwerking: evaluasie, verdunning met verdunners, verkoeling, toevoeging van kriobeskermers, verpakking in strooies, vries in vloeibare stikstof (−196°C).\nFase 3 – Vroulike Voorbereiding: estrus sinchronisasie, gesondheid sifting, voeding.\nFase 4 – Inseminasie Prosedure: ontdooiing, laai toestelle, invoeging, deponering by die optimale plek (serviks/baarmoeder/ovidukte volgens tegniek), en dokumentasie.\nFase 5 – Opvolg: swangerskap opsporing, rekordhouding, en voortgesette gesondheid monitering.',
        'IsiZulu': 'Inqubo ye-AI Ngamanyathelo:\nIsigaba 1 – Ukuqoqwa Kwesidoda: i-vagina eyenziwe, i-electroejaculation, izindlela zokwenza ngesandla (kuncike ezinhlotsheni); ukuhlolwa kwezinga lomthamo, ukugxila, ukuhamba, imilo.\nIsigaba 2 – Ukucubungulwa Kwesidoda: ukuhlolwa, ukuncibilikiswa ngezinto ezengeziwe, ukupholisa, ukwengeza izinto ezivikela ekubandayo, ukupakisha emishini, ukuqina kwi-nitrogen yamanzi (−196°C).\nIsigaba 3 – Ukulungiselelwa Kwesifazane: ukuvumelanisa i-estrus, ukuhlolwa kwezempilo, ukudla.\nIsigaba 4 – Inqubo Yokufakwa: ukuncibilika, ukulayisha izinto, ukufaka, ukubeka endaweni efanele (i-cervix/i-uterus/ama-oviducts ngokwemikhuba), nokubhalwa.\nIsigaba 5 – Ukulandela: ukutholwa kokukhulelwa, ukugcina amarekhodi, nokuqapha impilo eqhubekayo.',
        'IsiXhosa': 'Inkqubo ye-AI Ngamanyathelo:\nIsigaba 1 – Ukuqokelelwa Kwesidoda: i-vagina eyenziweyo, i-electroejaculation, iindlela zokwenza ngesandla (kuncike kwizinto); ukuhlolwa kwezinga lomthamo, ukugxila, ukuhamba, imilo.\nIsigaba 2 – Ukucubungulwa Kwesidoda: ukuhlolwa, ukuncibilikiswa ngezinto ezengeziweyo, ukupholisa, ukongeza izinto ezivikela ekubandayo, ukupakisha emishini, ukuqina kwi-nitrogen yamanzi (−196°C).\nIsigaba 3 – Ukulungiselelwa Kwesifazane: ukuvumelanisa i-estrus, ukuhlolwa kwezempilo, ukutya.\nIsigaba 4 – Inkqubo Yokufakwa: ukuncibilika, ukulayisha izinto, ukufaka, ukubeka kwindawo efaneleyo (i-cervix/i-uterus/ama-oviducts ngokwemikhuba), nokubhalwa.\nIsigaba 5 – Ukulandela: ukufunyanwa kokukhulelwa, ukugcina amarekhodi, nokuqwalasela impilo eqhubekayo.',
        'Sesotho': 'Mokhoa oa AI ka Mehato:\nKarolo 1 – Pokello ea Tshebe: vagina e entsoeng, electroejaculation, mekhoa ea matsoho (e itšetleha ka mefuta); tlhatlhobo ea boleng ba boholo, bokhutšoanyane, ho tsamaea, sebopeho.\nKarolo 2 – Tshebetso ea Tshebe: tlhatlhobo, ho nolofatsoa ka lintho tse nang le metsi, ho fokotsa mocheso, ho eketsa lintho tse tšireletsang ka mocheso o tlase, ho pakela ka lihlooho, ho qina ka nitrogen ea metsi (−196°C).\nKarolo 3 – Tlhabollo ea Basali: ho tsamaisana ha estrus, tlhatlhobo ea bophelo, lijo.\nKarolo 4 – Mokhoa oa Ho Kenngwa: ho nolofatsoa, ho tsenya lisebelisoa, ho kenya, ho beha sebakeng se lokelang (cervix/uterus/oviducts ka mokhoa), le ho ngola.\nKarolo 5 – Ho Latela: ho fumana boimana, ho boloka litekanyetso, le ho hlokomela bophelo bo tsoelang pele.',
        'Setswana': 'Mokgwa wa AI ka Mehato:\nKarolo 1 – Pokanyo ya Tshebe: vagina e e dirilweng, electroejaculation, mekgwa ya diatla (e itšetlela ka mefuta); tlhatlhobo ya boleng jwa bogolo, bokhutshwane, go tsamaya, sebopego.\nKarolo 2 – Tiro ya Tshebe: tlhatlhobo, go nolofatsa ka dilo tse di nang le metsi, go fokotsa mogote, go oketsa dilo tse di tšhireletsang ka mogote o o kwa tlase, go pakela ka ditlhogo, go qina ka nitrogen ya metsi (−196°C).\nKarolo 3 – Tlhagiso ya Basadi: go tsamaisana ga estrus, tlhatlhobo ya botshelo, dijo.\nKarolo 4 – Mokgwa wa Go Tsenngwa: go nolofatsa, go tsaya didirisiwa, go tsaya, go bea mo lefelong le le siameng (cervix/uterus/oviducts ka mokgwa), le go kwala.\nKarolo 5 – Go Latela: go fitlhelela boimana, go boloka ditshwetso, le go tlhokomela botshelo jo bo tswelang pele.',
        'SiSwati': 'Luhlelo lwe-AI ngeMinyathelo:\nSigaba 1 – Kubumbiwa Kwesidoda: i-vagina lelentiwe, i-electroejaculation, tindlela tematikhandlela (tincike etinhlotsheni); kuhlolwa kwebalinga bebulungu, kugxila, kuhamba, imilo.\nSigaba 2 – Kucubungulwa Kwesidoda: kuhlolwa, kunolofatswa ngetintfo letinyenti, kupholisa, kwengeta tintfo letivikela ekubandzayo, kupakisha emishini, kuqina kwi-nitrogen yemanti (−196°C).\nSigaba 3 – Kulungiselelwa Kwesifati: kuvumelanisa i-estrus, kuhlolwa kwebuhlanga, kudla.\nSigaba 4 – Luhlelo Lwekufakwa: kunolofatsa, kulayisha tintfo, kufaka, kubeka endzaweni lefanele (i-cervix/i-uterus/ema-oviducts ngetindlela), nekubhalwa.\nSigaba 5 – Kulandzela: kutfola kukhulelwa, kugcina emarekhodi, nekubuka buhlanga lobutsandzekako.',
        'IsiNdebele': 'Inqubo ye-AI Ngamanyathelo:\nIsigaba 1 – Ukuqoqwa Kwesidoda: i-vagina eyenziwe, i-electroejaculation, izindlela zokwenza ngesandla (kuncike ezinhlotsheni); ukuhlolwa kwezinga lomthamo, ukugxila, ukuhamba, imilo.\nIsigaba 2 – Ukucubungulwa Kwesidoda: ukuhlolwa, ukuncibilikiswa ngezinto ezengeziwe, ukupholisa, ukwengeza izinto ezivikela ekubandayo, ukupakisha emishini, ukuqina kwi-nitrogen yamanzi (−196°C).\nIsigaba 3 – Ukulungiselelwa Kwesifazane: ukuvumelanisa i-estrus, ukuhlolwa kwezempilo, ukudla.\nIsigaba 4 – Inqubo Yokufakwa: ukuncibilika, ukulayisha izinto, ukufaka, ukubeka endaweni efanele (i-cervix/i-uterus/ama-oviducts ngokwemikhuba), nokubhalwa.\nIsigaba 5 – Ukulandela: ukutholwa kokukhulelwa, ukugcina amarekhodi, nokuqapha impilo eqhubekayo.',
        'Sepedi': 'Mokgwa wa AI ka Mehato:\nKarolo 1 – Pokanyo ya Tshebe: vagina e e dirilweng, electroejaculation, mekgwa ya diatla (e itšetlela ka mefuta); tlhatlhobo ya boleng jwa bogolo, bokhutshwane, go tsamaya, sebopego.\nKarolo 2 – Tiro ya Tshebe: tlhatlhobo, go nolofatsa ka dilo tse di nang le metsi, go fokotsa mogote, go oketsa dilo tse di tšhireletsang ka mogote o o kwa tlase, go pakela ka ditlhogo, go qina ka nitrogen ya metsi (−196°C).\nKarolo 3 – Tlhagiso ya Basadi: go tsamaisana ga estrus, tlhatlhobo ya botshelo, dijo.\nKarolo 4 – Mokgwa wa Go Tsenngwa: go nolofatsa, go tsaya didirisiwa, go tsaya, go bea mo lefelong le le siameng (cervix/uterus/oviducts ka mokgwa), le go kwala.\nKarolo 5 – Go Latela: go fitlhelela boimana, go boloka ditshwetso, le go tlhokomela botshelo jo bo tswelang pele.',
        'Tshivenda': 'Muhango wa AI nga Mitevhe:\nTshipida 1 – U Bvumbiwa ha Tshebe: i-vagina ya mulimo, i-electroejaculation, maitele a maanḓa (a tshi itširela zwihulwane); u ḓivhadza vhukuma ha u ḓana, u ḓivhadza, u shuma, vhukuma.\nTshipida 2 – U Shumiswa ha Tshebe: u ḓivhadza, u nolofhadza nga zwishumiswa, u fhungudza mafhungo, u engedza zwishumiswa zwi tshi tshireletsa nga mafhungo a tshi si na, u pakhela nga matanda, u qina nga nitrogen ya madi (−196°C).\nTshipida 3 – Tshidzulo ya Vhafumakadzi: u vhambedza estrus, u ḓivhadza mveledziso, lwa lino.\nTshipida 4 – Muhango wa u Tsenngwa: u nolofhadza, u layisha zwishumiswa, u tsenya, u bvela nga ha nda i tshi si na (cervix/uterus/oviducts nga maitele), na u ngwala.\nTshipida 5 – U Latela: u wana boimana, u ḓivhadza zwibveledzwa, na u ḓivhadza mveledziso i tshi tswela.',
        'Xitsonga': 'Ntirho wa AI hi Mintirho:\nXikarhi 1 – Ku Bumbiwa ka Tshebe: i-vagina ya vukorhokeri, i-electroejaculation, maendlelo ya matimba (ya tshikeka hi swihlovo); ku kambela vukorhokeri bya nkarhi, ku kambela, ku tirha, vukorhokeri.\nXikarhi 2 – Ku Tirhisiwa ka Tshebe: ku kambela, ku pfumala hi swishumiswa, ku pfumala mafungo, ku engetela swishumiswa swi tshireletelaka hi mafungo ya pfumaleko, ku pakela hi swikhwama, ku qina hi nitrogen ya manti (−196°C).\nXikarhi 3 – Ku Lungiselela ka Wansati: ku vambeta estrus, ku kambela ntumbuluko, swakudya.\nXikarhi 4 – Ntirho wa ku Tsenngwa: ku pfumala, ku layisha swishumiswa, ku tsenya, ku tshika eka ndhawu ya vukorhokeri (cervix/uterus/oviducts hi maendlelo), ni ku tsala.\nXikarhi 5 – Ku Landzelela: ku kuma ku tsoala, ku tiyisekisa swibveledzwa, ni ku kambela ntumbuluko yi tswelaka.'
      },
      'Historical Background and Male Reproductive Fundamentals: Early development of AI: 1780s Spallanzani (dogs), 1899 (horses, Russia), 1930s–40s (cattle standardization), 1950s (frozen semen revolution), 1978 (human birth via AI + IVF). Modern era: sophisticated semen processing, computerized breeding programs, genetic selection, and adoption across species.\n\nMale anatomy relevance to AI: testes (sperm production), epididymis (maturation), ducts and accessory glands (seminal plasma). Links to semen quality, motility, morphology, and viability for successful insemination.': {
        'Afrikaans': 'Historiese Agtergrond en Manlike Voortplantingsfundamentele: Vroeë ontwikkeling van AI: 1780s Spallanzani (honde), 1899 (perde, Rusland), 1930s–40s (bees standaardisering), 1950s (gevriesde sperma rewolusie), 1978 (menslike geboorte via AI + IVF). Moderne era: gesofistikeerde sperma verwerking, gerekenariseerde teelprogramme, genetiese seleksie, en aanneming oor spesies heen.\n\nManlike anatomie relevansie tot AI: testes (sperma produksie), epididymis (rypwording), buise en bykomstige kliere (seminale plasma). Skakels met sperma kwaliteit, motiliteit, morfologie, en lewensvatbaarheid vir suksesvolle inseminasie.',
        'IsiZulu': 'Umlando Wokumva Nezimiso Zokuzala Zesilisa: Ukuthuthukiswa kwangaphambili kwe-AI: 1780s Spallanzani (izinja), 1899 (amahhashi, eRussia), 1930s–40s (ukulungiswa kwezinkomo), 1950s (inguquko yesidoda esiqinile), 1978 (ukuzalwa komuntu nge-AI + IVF). Isikhathi samanje: ukucubungulwa kwesidoda okunobuchwepheshe, izinhlelo zokuzalisa ezisekhompyutha, ukukhetha izakhi zofuzo, nokwamukelwa kuzo zonke izinhlobo.\n\nUkufana kwe-anatomy yesilisa ne-AI: ama-testes (ukukhiqizwa kwesidoda), i-epididymis (ukuvuthwa), amashubhu nezindlala ezengeziwe (i-seminal plasma). Ukuxhumana nezinga lesidoda, ukuhamba, imilo, nokusebenza kokufakwa ngempumelelo.',
        'IsiXhosa': 'Umlando Wokumva Nezimiso Zokuzala Zesilisa: Ukuthuthukiswa kwangaphambili kwe-AI: 1780s Spallanzani (izinja), 1899 (amahhashi, eRussia), 1930s–40s (ukulungiswa kwezinkomo), 1950s (inguquko yesidoda esiqinile), 1978 (ukuzalwa komuntu nge-AI + IVF). Ixesha langoku: ukucubungulwa kwesidoda okunobuchwepheshe, izinhlelo zokuzalisa ezisekhompyutha, ukukhetha izakhi zofuzo, nokwamukelwa kuzo zonke iintlobo.\n\nUkufana kwe-anatomy yesilisa ne-AI: ama-testes (ukukhiqizwa kwesidoda), i-epididymis (ukuvuthwa), amashubhu nezindlala ezengeziweyo (i-seminal plasma). Ukuxhumana nezinga lesidoda, ukuhamba, imilo, nokusebenza kokufakwa ngempumelelo.',
        'Sesotho': 'Histori ea Pele le Melao ea Bohlokoa ea Ho Tsoala (Banna): Tlhabollo ea pele ea AI: 1780s Spallanzani (dinja), 1899 (dipitsa, Russia), 1930s–40s (ho lokisa dikhomo), 1950s (phetoho ea tshebe e qineng), 1978 (tsoalo ea batho ka AI + IVF). Nako ea kajeno: tshebetso e matla ea tshebe, mananeo a ho tsoala a khomputara, khetho ea genetics, le ho amohela mefuteng eohle.\n\nHo tshwaneleha ha anatomy ea banna le AI: testes (tlhahiso ea tshebe), epididymis (ho lokisoa), li-ducts le li-glands tse nang le tsa tlaleho (seminal plasma). Khokahano le boleng ba tshebe, ho tsamaea, sebopeho, le bokhoni ba ho kenngoa ka katleho.',
        'Setswana': 'Histori ya Pele le Melao ya Botlhokwa ya Go Tsoala (Banna): Tlhagiso ya pele ya AI: 1780s Spallanzani (dintja), 1899 (dipitse, Russia), 1930s–40s (go lokisa dikgomo), 1950s (phetogo ya tshebe e e qineng), 1978 (tsoalo ya batho ka AI + IVF). Nako ya gompieno: tiro e e matla ya tshebe, mananeo a go tsoala a khomputara, kgetso ya genetics, le go amohela mefuteng yohle.\n\nGo tshwanelega ga anatomy ya banna le AI: testes (tlhagiso ya tshebe), epididymis (go lokiswa), li-ducts le li-glands tse di nang le tsa tlaleho (seminal plasma). Khokahano le boleng jwa tshebe, go tsamaya, sebopego, le bokgoni jwa go tsenngwa ka katlego.',
        'SiSwati': 'Umlando Wokumva Nemigomo Leyisiseko Yekuzala (Bafana): Kutfutfukisa kwangaphambili kwe-AI: 1780s Spallanzani (tinja), 1899 (tihashi, eRussia), 1930s–40s (kulungisa tinkhomo), 1950s (inguquko yesidoda lesiqinile), 1978 (kuzalwa kwemuntfu nge-AI + IVF). Sikhatsi sanamuhla: kucubungulwa kwesidoda lokunobuchwepheshe, tinhlelo tekuzala letisekhompyutha, kukhetfwa kwezakhi zofuzo, nekukwamukelwa kuzo zonke tinhlobo.\n\nKufana kwe-anatomy yemfana ne-AI: ema-testes (kukhicita sidoda), i-epididymis (kuvutwa), emashubhu netindlala letinyenti (i-seminal plasma). Kuxhumana nebalinga besidoda, kuhamba, imilo, nekutsebenta kwekufakwa ngekucinisekile.',
        'IsiNdebele': 'Umlando Wokumva Nezimiso Zokuzala Zesilisa: Ukuthuthukiswa kwangaphambili kwe-AI: 1780s Spallanzani (izinja), 1899 (amahhashi, eRussia), 1930s–40s (ukulungiswa kwezinkomo), 1950s (inguquko yesidoda esiqinile), 1978 (ukuzalwa komuntu nge-AI + IVF). Isikhathi samanje: ukucubungulwa kwesidoda okunobuchwepheshe, izinhlelo zokuzalisa ezisekhompyutha, ukukhetha izakhi zofuzo, nokwamukelwa kuzo zonke izinhlobo.\n\nUkufana kwe-anatomy yesilisa ne-AI: ama-testes (ukukhiqizwa kwesidoda), i-epididymis (ukuvuthwa), amashubhu nezindlala ezengeziwe (i-seminal plasma). Ukuxhumana nezinga lesidoda, ukuhamba, imilo, nokusebenza kokufakwa ngempumelelo.',
        'Sepedi': 'Histori ya Pele le Melao ya Botlhokwa ya Go Tsoala (Banna): Tlhagiso ya pele ya AI: 1780s Spallanzani (dintja), 1899 (dipitse, Russia), 1930s–40s (go lokisa dikgomo), 1950s (phetogo ya tshebe e e qineng), 1978 (tsoalo ya batho ka AI + IVF). Nako ya gompieno: tiro e e matla ya tshebe, mananeo a go tsoala a khomputara, kgetso ya genetics, le go amohela mefuteng yohle.\n\nGo tshwanelega ga anatomy ya banna le AI: testes (tlhagiso ya tshebe), epididymis (go lokiswa), li-ducts le li-glands tse di nang le tsa tlaleho (seminal plasma). Khokahano le boleng jwa tshebe, go tsamaya, sebopego, le bokgoni jwa go tsenngwa ka katlego.',
        'Tshivenda': 'Histori ya Pele na Milayo ya Vhukuma ya u Tsoala (Vhanna): Tshidzulo tsha peḽe tsha AI: 1780s Spallanzani (mbwa), 1899 (mahashi, Russia), 1930s–40s (u lugisela dziṅoma), 1950s (tshidzulo tsha tshebe i tshi qina), 1978 (tsoalo ya vhathu nga AI + IVF). Nga u ḓi: u shumiswa ha tshebe ha mulimo, mananeo a u tsoala a khompyutha, u khethwa ha genetics, na u ḓivhadzwa zwihulwane zwoṱhe.\n\nU tshwanelela ha anatomy ya vhanna na AI: ma-testes (u bveledzisa tshebe), i-epididymis (u lugisela), ma-ducts na ma-glands a maitele (seminal plasma). U vhambedza vhukuma ha tshebe, u shuma, vhukuma, na u shuma ha u tsenngwa nga katleho.',
        'Xitsonga': 'Histori ya Pele ni Milawu ya Vukorhokeri bya ku Tsoala (Vhanna): Ku Tshidzula ka Pele ka AI: 1780s Spallanzani (tinja), 1899 (tihasi, Russia), 1930s–40s (ku lungiselela timhongo), 1950s (ku cinca ka tshebe yi qine), 1978 (ku tsoala ka vanhu hi AI + IVF). Nkarhi wa namuntlha: ku tirhisa tshebe ka vukorhokeri, manano ya ku tsoala ya khompyuta, ku hlawula genetics, ni ku amukela swihlovo hinkwaswo.\n\nKu fanela ka anatomy ya vhanna na AI: ma-testes (ku vumbiwa tshebe), i-epididymis (ku lungiselela), ma-ducts ni ma-glands ya maendlelo (seminal plasma). Ku hambana ni vukorhokeri bya tshebe, ku tirha, vukorhokeri, ni ku tirha ka ku tsenngwa hi mpumelelo.'
      },
      'Estrus detection tips': {
        'Afrikaans': 'Wenke vir estrus opsporing',
        'IsiZulu': 'Amathiphu okuthola i-estrus',
        'IsiXhosa': 'Iingcebiso zokufumana i-estrus',
        'Sesotho': 'Lits\'upiso tsa ho fumana estrus',
        'Setswana': 'Ditshupiso tsa go fitlhelela estrus',
        'SiSwati': 'Titshupiso tekutfola estrus',
        'IsiNdebele': 'Amathiphu okuthola i-estrus',
        'Sepedi': 'Ditshupiso tsa go fitlhelela estrus',
        'Tshivenda': 'Zwitshupiso zwa u wana estrus',
        'Xitsonga': 'Switshupiso swa ku kuma estrus'
      }
    }

    // Check if we have a translation for this content
    if (translations[content] && translations[content][language]) {
      return translations[content][language]
    }

    // Fallback to English if no translation available
    return content
  }

  // Get translated UI text
  const getTranslatedText = (key: string, language: string): string => {
    const uiTranslations: Record<string, Record<string, string>> = {
      'Lesson Video': {
        'Afrikaans': 'Les Video',
        'IsiZulu': 'Ividiyo Yesifundo',
        'IsiXhosa': 'Ividiyo Yesifundo',
        'Sesotho': 'Video ea Thuto',
        'Setswana': 'Video ya Thuto',
        'SiSwati': 'Ividiyo Yesifundo',
        'IsiNdebele': 'Ividiyo Yesifundo',
        'Sepedi': 'Video ya Thuto',
        'Tshivenda': 'Video ya Thuto',
        'Xitsonga': 'Video ya Thuto'
      },
      'Watch the instructional video for this lesson': {
        'Afrikaans': 'Kyk na die instruksie-video vir hierdie les',
        'IsiZulu': 'Buka ividiyo yemiyalo yesifundo',
        'IsiXhosa': 'Bona ividiyo yemiyalo yesifundo',
        'Sesotho': 'Sheba video ea tlhahiso ea thuto ena',
        'Setswana': 'Lebelela video ya taelo ya thuto eno',
        'SiSwati': 'Buka ividiyo yemiyalo yesifundo',
        'IsiNdebele': 'Buka ividiyo yemiyalo yesifundo',
        'Sepedi': 'Lebelela video ya taelo ya thuto eno',
        'Tshivenda': 'Vhona video ya taelo ya thuto iyi',
        'Xitsonga': 'Vona video ya taelo ya thuto leyi'
      },
      'Key Concepts': {
        'Afrikaans': 'Sleutelkonsepte',
        'IsiZulu': 'Imiqondo Eyinhloko',
        'IsiXhosa': 'Imiqalo Eyinhloko',
        'Sesotho': 'Melao ea Bohlokoa',
        'Setswana': 'Dikgopolo tsa Botlhokwa',
        'SiSwati': 'Imiqondo Eyinhloko',
        'IsiNdebele': 'Imiqondo Eyinhloko',
        'Sepedi': 'Dikgopolo tsa Botlhokwa',
        'Tshivenda': 'Mikumbulo ya Vhukuma',
        'Xitsonga': 'Mikumbulo ya Vukuma'
      },
      'Important information to understand': {
        'Afrikaans': 'Belangrike inligting om te verstaan',
        'IsiZulu': 'Ulwazi olubalulekile okuqondwa',
        'IsiXhosa': 'Ulwazi olubalulekileyo okuqondwa',
        'Sesotho': 'Tsebo ea bohlokoa ho utloisisoa',
        'Setswana': 'Tsebo e e botlhokwa go utlwisisiwa',
        'SiSwati': 'Lwati olubalulekile lokwatiwa',
        'IsiNdebele': 'Ulwazi olubalulekile okuqondwa',
        'Sepedi': 'Tsebo e e botlhokwa go utlwisisiwa',
        'Tshivenda': 'Ndivho ya vhukuma u pfesesa',
        'Xitsonga': 'Vutivi bya vukuma bya ku pfesesa'
      },
      'Quick Check': {
        'Afrikaans': 'Vinnige Toets',
        'IsiZulu': 'Ukuhlolwa Okusheshayo',
        'IsiXhosa': 'Ukuhlolwa Okukhawulezayo',
        'Sesotho': 'Tekanyetso e Potlakileng',
        'Setswana': 'Tlhahlobo e e Potlakileng',
        'SiSwati': 'Ukuhlolwa Okusheshayo',
        'IsiNdebele': 'Ukuhlolwa Okusheshayo',
        'Sepedi': 'Tlhahlobo e e Potlakileng',
        'Tshivenda': 'Tshetshekanyo e Pfukaho',
        'Xitsonga': 'Tshetshekanyo e Pfukaho'
      },
      'Test your understanding of this lesson': {
        'Afrikaans': 'Toets jou begrip van hierdie les',
        'IsiZulu': 'Hlola ukuqonda kwakho kwesifundo',
        'IsiXhosa': 'Hlola ukuqonda kwakho kwesifundo',
        'Sesotho': 'Leka kutlwisiso ya hao ea thuto ena',
        'Setswana': 'Leka kutlwisiso ya gago ya thuto eno',
        'SiSwati': 'Hlola ukuqonda kwakho kwesifundo',
        'IsiNdebele': 'Hlola ukuqonda kwakho kwesifundo',
        'Sepedi': 'Leka kutlwisiso ya gago ya thuto eno',
        'Tshivenda': 'Lingedza pfeseso ya vhugudo ha thuto iyi',
        'Xitsonga': 'Lingedza pfeseso ya vhugudo ha thuto leyi'
      },
      'Back to Courses': {
        'Afrikaans': 'Terug na Kursusse',
        'IsiZulu': 'Buyela Emakhosini',
        'IsiXhosa': 'Buyela Kwizifundo',
        'Sesotho': 'Khoela Ho Likorase',
        'Setswana': 'Boela Kwa Dithuto',
        'SiSwati': 'Buyela Emakhosini',
        'IsiNdebele': 'Buyela Emakhosini',
        'Sepedi': 'Boela Kwa Dithuto',
        'Tshivenda': 'Vhuyelela Kha Dithuto',
        'Xitsonga': 'Hluvukela Eka Dithuto'
      },
      'Lesson': {
        'Afrikaans': 'Les',
        'IsiZulu': 'Isifundo',
        'IsiXhosa': 'Isifundo',
        'Sesotho': 'Thuto',
        'Setswana': 'Thuto',
        'SiSwati': 'Isifundo',
        'IsiNdebele': 'Isifundo',
        'Sepedi': 'Thuto',
        'Tshivenda': 'Thuto',
        'Xitsonga': 'Thuto'
      },
      'of': {
        'Afrikaans': 'van',
        'IsiZulu': 'kwe',
        'IsiXhosa': 'kwe',
        'Sesotho': 'ho',
        'Setswana': 'ya',
        'SiSwati': 'kwe',
        'IsiNdebele': 'kwe',
        'Sepedi': 'ya',
        'Tshivenda': 'ya',
        'Xitsonga': 'ya'
      },
      'min': {
        'Afrikaans': 'min',
        'IsiZulu': 'min',
        'IsiXhosa': 'min',
        'Sesotho': 'min',
        'Setswana': 'min',
        'SiSwati': 'min',
        'IsiNdebele': 'min',
        'Sepedi': 'min',
        'Tshivenda': 'min',
        'Xitsonga': 'min'
      },
      'Language:': {
        'Afrikaans': 'Taal:',
        'IsiZulu': 'Ulimi:',
        'IsiXhosa': 'Ulwimi:',
        'Sesotho': 'Puo:',
        'Setswana': 'Puo:',
        'SiSwati': 'Lulwimi:',
        'IsiNdebele': 'Ulimi:',
        'Sepedi': 'Puo:',
        'Tshivenda': 'Luambo:',
        'Xitsonga': 'Ririmi:'
      },
      'Complete': {
        'Afrikaans': 'Voltooi',
        'IsiZulu': 'Qedile',
        'IsiXhosa': 'Gqityiwe',
        'Sesotho': 'Fetile',
        'Setswana': 'Fetile',
        'SiSwati': 'Qedile',
        'IsiNdebele': 'Qedile',
        'Sepedi': 'Fetile',
        'Tshivenda': 'Fhedzi',
        'Xitsonga': 'Fetile'
      },
      'lessons': {
        'Afrikaans': 'lesse',
        'IsiZulu': 'izifundo',
        'IsiXhosa': 'izifundo',
        'Sesotho': 'dithuto',
        'Setswana': 'dithuto',
        'SiSwati': 'tifundo',
        'IsiNdebele': 'izifundo',
        'Sepedi': 'dithuto',
        'Tshivenda': 'dithuto',
        'Xitsonga': 'dithuto'
      },
      'Duration:': {
        'Afrikaans': 'Duur:',
        'IsiZulu': 'Isikhathi:',
        'IsiXhosa': 'Ixesha:',
        'Sesotho': 'Nako:',
        'Setswana': 'Nako:',
        'SiSwati': 'Sikhatsi:',
        'IsiNdebele': 'Isikhathi:',
        'Sepedi': 'Nako:',
        'Tshivenda': 'Nga:',
        'Xitsonga': 'Nkarhi:'
      },
      'minutes': {
        'Afrikaans': 'minute',
        'IsiZulu': 'amaminithi',
        'IsiXhosa': 'iimizuzu',
        'Sesotho': 'metsotso',
        'Setswana': 'ditsotso',
        'SiSwati': 'emaminithi',
        'IsiNdebele': 'amaminithi',
        'Sepedi': 'ditsotso',
        'Tshivenda': 'mitsotso',
        'Xitsonga': 'mintsotso'
      },
      'Video Lesson': {
        'Afrikaans': 'Video Les',
        'IsiZulu': 'Isifundo Sevidiyo',
        'IsiXhosa': 'Isifundo Sevidiyo',
        'Sesotho': 'Thuto ea Video',
        'Setswana': 'Thuto ya Video',
        'SiSwati': 'Sifundo Sevidiyo',
        'IsiNdebele': 'Isifundo Sevidiyo',
        'Sepedi': 'Thuto ya Video',
        'Tshivenda': 'Thuto ya Video',
        'Xitsonga': 'Thuto ya Video'
      },
      'Progress:': {
        'Afrikaans': 'Vordering:',
        'IsiZulu': 'Intuthuko:',
        'IsiXhosa': 'Intshukumo:',
        'Sesotho': 'Ntšo:',
        'Setswana': 'Tswelopele:',
        'SiSwati': 'Intfutfuko:',
        'IsiNdebele': 'Intuthuko:',
        'Sepedi': 'Tswelopele:',
        'Tshivenda': 'Tshumiselo:',
        'Xitsonga': 'Ntirhisano:'
      },
      'Previous': {
        'Afrikaans': 'Vorige',
        'IsiZulu': 'Okwangaphambilini',
        'IsiXhosa': 'Okwangaphambili',
        'Sesotho': 'E fetileng',
        'Setswana': 'E fetileng',
        'SiSwati': 'Lokudlule',
        'IsiNdebele': 'Okwangaphambilini',
        'Sepedi': 'E fetileng',
        'Tshivenda': 'E tshi fhiraho',
        'Xitsonga': 'E ku nga endzhaku'
      },
      'Next': {
        'Afrikaans': 'Volgende',
        'IsiZulu': 'Okulandelayo',
        'IsiXhosa': 'Okulandelayo',
        'Sesotho': 'E tlang',
        'Setswana': 'E e tlang',
        'SiSwati': 'Lokulandzelako',
        'IsiNdebele': 'Okulandelayo',
        'Sepedi': 'E e tlang',
        'Tshivenda': 'E tshi taka',
        'Xitsonga': 'E ku nga emahlweni'
      },
      'Navigate': {
        'Afrikaans': 'Navigeer',
        'IsiZulu': 'Hamba',
        'IsiXhosa': 'Hamba',
        'Sesotho': 'Tsa',
        'Setswana': 'Tsamaya',
        'SiSwati': 'Hamba',
        'IsiNdebele': 'Hamba',
        'Sepedi': 'Tsamaya',
        'Tshivenda': 'Tshimbila',
        'Xitsonga': 'Tshama'
      },
      'Course not found': {
        'Afrikaans': 'Kursus nie gevind nie',
        'IsiZulu': 'Ikosi ayitholakalanga',
        'IsiXhosa': 'Isifundo asifunyenwanga',
        'Sesotho': 'Korase ha e fumanahala',
        'Setswana': 'Thuto ga e fitlhehala',
        'SiSwati': 'Khoshi ayitholakali',
        'IsiNdebele': 'Ikosi ayitholakalanga',
        'Sepedi': 'Thuto ga e fitlhehala',
        'Tshivenda': 'Thuto a i wanali',
        'Xitsonga': 'Thuto a yi kumeki'
      },
      'Course Modules': {
        'Afrikaans': 'Kursus Modules',
        'IsiZulu': 'Amamojula Ekosi',
        'IsiXhosa': 'Iimojula Zesifundo',
        'Sesotho': 'Likarolo tsa Korase',
        'Setswana': 'Dikarolo tsa Thuto',
        'SiSwati': 'Emamojula Ekoshi',
        'IsiNdebele': 'Amamojula Ekosi',
        'Sepedi': 'Dikarolo tsa Thuto',
        'Tshivenda': 'Mikumbulo ya Thuto',
        'Xitsonga': 'Swikarhi swa Thuto'
      },
      'Your Progress': {
        'Afrikaans': 'Jou Vordering',
        'IsiZulu': 'Intuthuko Yakho',
        'IsiXhosa': 'Intshukumo Yakho',
        'Sesotho': 'Ntšo ea Hao',
        'Setswana': 'Tswelopele ya Gago',
        'SiSwati': 'Intfutfuko Yakho',
        'IsiNdebele': 'Intuthuko Yakho',
        'Sepedi': 'Tswelopele ya Gago',
        'Tshivenda': 'Tshumiselo Thau',
        'Xitsonga': 'Ntirhisano Wa Wena'
      },
      'Completed': {
        'Afrikaans': 'Voltooi',
        'IsiZulu': 'Kuqediwe',
        'IsiXhosa': 'Kugqityiwe',
        'Sesotho': 'Ho fetile',
        'Setswana': 'Go fetile',
        'SiSwati': 'Kuphelile',
        'IsiNdebele': 'Kuqediwe',
        'Sepedi': 'Go fetile',
        'Tshivenda': 'Hu fhedzi',
        'Xitsonga': 'Ku fete'
      },
      'Total': {
        'Afrikaans': 'Totaal',
        'IsiZulu': 'Isamba',
        'IsiXhosa': 'Isamba',
        'Sesotho': 'Kakaretso',
        'Setswana': 'Kakaretso',
        'SiSwati': 'Sisamba',
        'IsiNdebele': 'Isamba',
        'Sepedi': 'Kakaretso',
        'Tshivenda': 'Tshifhinganyana',
        'Xitsonga': 'Xikarhi'
      },
      'Time Spent': {
        'Afrikaans': 'Tyd Bestee',
        'IsiZulu': 'Isikhathi Esichithiwe',
        'IsiXhosa': 'Ixesha Elichithiweyo',
        'Sesotho': 'Nako e Sebelitsoeng',
        'Setswana': 'Nako e e Tseilweng',
        'SiSwati': 'Sikhatsi Lesichitjiwe',
        'IsiNdebele': 'Isikhathi Esichithiwe',
        'Sepedi': 'Nako e e Tseilweng',
        'Tshivenda': 'Nga i Tshi Tshumiswa',
        'Xitsonga': 'Nkarhi Lowu Tirhisiwaka'
      },
      'Overall Progress': {
        'Afrikaans': 'Algehele Vordering',
        'IsiZulu': 'Intuthuko Ephelele',
        'IsiXhosa': 'Intshukumo Epheleleyo',
        'Sesotho': 'Ntšo e Felletseng',
        'Setswana': 'Tswelopele e e Felletseng',
        'SiSwati': 'Intfutfuko Lephelele',
        'IsiNdebele': 'Intuthuko Ephelele',
        'Sepedi': 'Tswelopele e e Felletseng',
        'Tshivenda': 'Tshumiselo Tsho Fhelelaho',
        'Xitsonga': 'Ntirhisano Lowu Feleriweke'
      },
      'Keyboard shortcuts:': {
        'Afrikaans': 'Sleutelbord kortpaaie:',
        'IsiZulu': 'Izingcindezo zekhibhodi:',
        'IsiXhosa': 'Iingcindezo zekhibhodi:',
        'Sesotho': 'Mekhoa e khutšoanyane ea khibhode:',
        'Setswana': 'Mekgwa e mekhutshwane ya khibhoto:',
        'SiSwati': 'Tingcindezo tekhibhodi:',
        'IsiNdebele': 'Izingcindezo zekhibhodi:',
        'Sepedi': 'Mekgwa e mekhutshwane ya khibhoto:',
        'Tshivenda': 'Mihanda ya khibhodo:',
        'Xitsonga': 'Switshukumo swa khibhoto:'
      },
      'Start Watching': {
        'Afrikaans': 'Begin Kyk',
        'IsiZulu': 'Qala Ukubuka',
        'IsiXhosa': 'Qala Ukubona',
        'Sesotho': 'Qala Ho Sheba',
        'Setswana': 'Simolola Go Lebelela',
        'SiSwati': 'Qala Kubuka',
        'IsiNdebele': 'Qala Ukubuka',
        'Sepedi': 'Simolola Go Lebelela',
        'Tshivenda': 'Thoma U Vhona',
        'Xitsonga': 'Hlamula Ku Vona'
      },
      'Mark as Complete': {
        'Afrikaans': 'Merk as Voltooi',
        'IsiZulu': 'Phawula Njengokuphelile',
        'IsiXhosa': 'Phawula Njengokugqityiweyo',
        'Sesotho': 'Tšoaea E le E Fetileng',
        'Setswana': 'Tshwaetsa E le E Fetileng',
        'SiSwati': 'Phawula Njengokuphelile',
        'IsiNdebele': 'Phawula Njengokuphelile',
        'Sepedi': 'Tshwaetsa E le E Fetileng',
        'Tshivenda': 'Shimbidza E ri E Fhedzi',
        'Xitsonga': 'Khomba Eka Ku Fete'
      },
      'Video not available': {
        'Afrikaans': 'Video nie beskikbaar nie',
        'IsiZulu': 'Ividiyo ayitholakali',
        'IsiXhosa': 'Ividiyo ayifumaneki',
        'Sesotho': 'Video ha e fumanahale',
        'Setswana': 'Video ga e fitlhehale',
        'SiSwati': 'Vidiyo ayitholakali',
        'IsiNdebele': 'Ividiyo ayitholakali',
        'Sepedi': 'Video ga e fitlhehale',
        'Tshivenda': 'Video a i wanali',
        'Xitsonga': 'Video a yi kumeki'
      },
      'Please contact support if this issue persists.': {
        'Afrikaans': 'Kontak asseblief ondersteuning as hierdie probleem voortduur.',
        'IsiZulu': 'Sicela uxhumane nokusekelwa uma lenkinga iqhubeka.',
        'IsiXhosa': 'Nceda uqhagamshelane nenkxaso ukuba eli ngxaki liqhubeka.',
        'Sesotho': 'Ka kopo ikopanye le tšehetso haeba bothata bo tsoela pele.',
        'Setswana': 'Tsweetswee ikgolaganye le thekgo fa bothata jono bo tswelela.',
        'SiSwati': 'Sicela uxhumane nentfutfuko uma lenkinga iqhubeka.',
        'IsiNdebele': 'Sicela uxhumane nokusekelwa uma lenkinga iqhubeka.',
        'Sepedi': 'Tsweetswee ikgolaganye le thekgo ge bothata bjo bo tswelela.',
        'Tshivenda': 'Ndi khou humbela u vhudzane na tshetshedzo arali mulandu u tshi khou tswela.',
        'Xitsonga': 'Hi kombela u vuxana na nhlayiso loko xiphiqo xi tswela.'
      },
      'Courses': {
        'Afrikaans': 'Kursusse',
        'IsiZulu': 'Amakhosi',
        'IsiXhosa': 'Izifundo',
        'Sesotho': 'Likorase',
        'Setswana': 'Dithuto',
        'SiSwati': 'Amakhoshi',
        'IsiNdebele': 'Amakhosi',
        'Sepedi': 'Dithuto',
        'Tshivenda': 'Dithuto',
        'Xitsonga': 'Dithuto'
      }
    }

    return uiTranslations[key]?.[language] || key
  }

  const isLessonCompleted = (moduleIndex: number, lessonIndex: number): boolean => {
    if (!course || !progress) return false
    const lesson = course.modules[moduleIndex]?.lessons[lessonIndex]
    return lesson ? progress.completedLessons.includes(lesson.id) : false
  }

  const canAccessLesson = (moduleIndex: number, lessonIndex: number): boolean => {
    // Allow access to first lesson and any completed lessons
    if (moduleIndex === 0 && lessonIndex === 0) return true
    
    // Check if previous lesson is completed
    if (lessonIndex > 0) {
      return isLessonCompleted(moduleIndex, lessonIndex - 1)
    } else if (moduleIndex > 0) {
      const prevModule = course?.modules[moduleIndex - 1]
      if (prevModule) {
        return isLessonCompleted(moduleIndex - 1, prevModule.lessons.length - 1)
      }
    }
    
    return false
  }

  const navigateToLesson = (moduleIndex: number, lessonIndex: number) => {
    if (canAccessLesson(moduleIndex, lessonIndex)) {
      setCurrentModuleIndex(moduleIndex)
      setCurrentLessonIndex(lessonIndex)
      
      // Reset lesson progress when navigating to a new lesson
      const newLesson = course?.modules[moduleIndex]?.lessons[lessonIndex]
      if (newLesson && progress) {
        // If lesson is already completed, set progress to 100%, otherwise 0%
        setLessonProgress(progress.completedLessons.includes(newLesson.id) ? 100 : 0)
      } else {
        setLessonProgress(0)
      }
    }
  }

  const nextLesson = () => {
    if (!course) return
    
    const currentModule = course.modules[currentModuleIndex]
    if (currentLessonIndex < currentModule.lessons.length - 1) {
      setCurrentLessonIndex(prev => prev + 1)
    } else if (currentModuleIndex < course.modules.length - 1) {
      setCurrentModuleIndex(prev => prev + 1)
      setCurrentLessonIndex(0)
    }
    
    // Set progress for the new lesson
    const newModuleIndex = currentLessonIndex < currentModule.lessons.length - 1 ? currentModuleIndex : currentModuleIndex + 1
    const newLessonIndex = currentLessonIndex < currentModule.lessons.length - 1 ? currentLessonIndex + 1 : 0
    const newLesson = course.modules[newModuleIndex]?.lessons[newLessonIndex]
    
    if (newLesson && progress) {
      setLessonProgress(progress.completedLessons.includes(newLesson.id) ? 100 : 0)
    } else {
      setLessonProgress(0)
    }
  }

  const previousLesson = () => {
    if (!course) return
    
    let newModuleIndex = currentModuleIndex
    let newLessonIndex = currentLessonIndex
    
    if (currentLessonIndex > 0) {
      newLessonIndex = currentLessonIndex - 1
    } else if (currentModuleIndex > 0) {
      const prevModule = course.modules[currentModuleIndex - 1]
      if (prevModule) {
        newModuleIndex = currentModuleIndex - 1
        newLessonIndex = prevModule.lessons.length - 1
      }
    }
    
    setCurrentModuleIndex(newModuleIndex)
    setCurrentLessonIndex(newLessonIndex)
    
    // Set progress for the new lesson
    const newLesson = course.modules[newModuleIndex]?.lessons[newLessonIndex]
    if (newLesson && progress) {
      setLessonProgress(progress.completedLessons.includes(newLesson.id) ? 100 : 0)
    } else {
      setLessonProgress(0)
    }
  }

  const handleLessonProgress = (progressPercent: number) => {
    setLessonProgress(progressPercent)
    
    // Update progress in backend when significant milestones are reached
    const currentLesson = getCurrentLesson()
    if (currentLesson && progressPercent >= 90) {
      updateLessonProgress(currentLesson.id, true, 100)
    } else if (currentLesson) {
      updateLessonProgress(currentLesson.id, false, progressPercent)
    }
  }

  const updateLessonProgress = async (lessonId: string, completed: boolean, progressPercent: number) => {
    try {
      await api.updateProgress(courseId, lessonId, {
        completed,
        timeSpent: Math.floor((progressPercent / 100) * (getCurrentLesson()?.duration || 0) * 60) // Convert minutes to seconds
      })
      
      // Reload progress to get updated state
      loadProgress()
    } catch (error) {
      console.error('Failed to update lesson progress:', error)
    }
  }

  const handleLessonComplete = () => {
    const currentLesson = getCurrentLesson()
    if (currentLesson) {
      setLessonProgress(100)
      updateLessonProgress(currentLesson.id, true, 100)
      
      // Automatically advance to next lesson after a short delay
      setTimeout(() => {
        nextLesson()
      }, 2000)
    }
  }

  const handleQuizComplete = (result: QuizResult) => {
    if (result.passed) {
      handleLessonComplete()
    }
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Only handle shortcuts when not typing in input fields
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return
      }

      switch (event.key.toLowerCase()) {
        case ' ': // Spacebar - toggle play/pause (for video lessons)
          event.preventDefault()
          // This will be handled by VideoPlayer component
          break
        case 'arrowleft':
          event.preventDefault()
          previousLesson()
          break
        case 'arrowright':
          event.preventDefault()
          nextLesson()
          break
        case 'n':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault()
            nextLesson()
          }
          break
        case 'p':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault()
            previousLesson()
          }
          break
        case 'escape':
          event.preventDefault()
          onBack()
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [onBack, previousLesson, nextLesson])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <p>{getTranslatedText('Course not found', selectedLanguage)}</p>
        <Button onClick={onBack} className="mt-4">
          {getTranslatedText('Back to Courses', selectedLanguage)}
        </Button>
      </div>
    )
  }

  const currentLesson = getCurrentLesson()
  const totalLessons = getTotalLessons()
  const currentLessonNumber = getCurrentLessonNumber()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Top row with back button and breadcrumbs */}
          <div className="flex items-center gap-4 mb-3">
            <Button variant="ghost" onClick={onBack} className="hover:bg-gray-100 transition-colors">
              <ChevronLeft className="h-4 w-4 mr-1" />
              {getTranslatedText('Back to Courses', selectedLanguage)}
            </Button>
            <div className="flex items-center text-sm text-gray-500">
              <span>{getTranslatedText('Courses', selectedLanguage)}</span>
              <ChevronRight className="h-3 w-3 mx-2" />
              <span className="font-medium text-gray-700">{course.title}</span>
            </div>
          </div>
          
          {/* Main header content */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{course.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <span className="font-medium">{getTranslatedText('Lesson', selectedLanguage)} {currentLessonNumber}</span>
                  <span>{getTranslatedText('of', selectedLanguage)} {totalLessons}</span>
                </span>
                <span className="text-gray-400">•</span>
                <span className="font-medium">{currentLesson?.title}</span>
                <span className="text-gray-400">•</span>
                <span>{currentLesson?.duration} {getTranslatedText('min', selectedLanguage)}</span>
              </div>
            </div>
            
            {/* Progress section */}
            <div className="flex items-center gap-6">
              {/* Language Selector */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{getTranslatedText('Language:', selectedLanguage)}</span>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="text-sm border border-gray-300 rounded-md px-3 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.nativeName}>
                      {lang.nativeName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {Math.round(getOverallProgress())}% {getTranslatedText('Complete', selectedLanguage)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {progress?.completedLessons.length || 0} {getTranslatedText('of', selectedLanguage)} {totalLessons} {getTranslatedText('lessons', selectedLanguage)}
                  </div>
                </div>
                <Progress 
                  value={getOverallProgress()} 
                  className="w-32 h-2"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Course Content */}
          <div className="lg:col-span-3">
            {currentLesson && (
              <div className="space-y-8">
                {/* Lesson Content */}
                {currentLesson.type === 'video' && (
                  <div className="space-y-6">
                    {/* Video Section */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Play className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{getTranslatedText('Lesson Video', selectedLanguage)}</h3>
                              <p className="text-gray-600 text-sm">{getTranslatedText('Watch the instructional video for this lesson', selectedLanguage)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              {selectedLanguage}
                            </span>
                            <div className="text-sm text-gray-500">
                              Progress: {Math.round(lessonProgress)}%
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-0">
                        <VideoPlayer
                          lesson={currentLesson}
                          courseId={courseId}
                          onProgress={handleLessonProgress}
                          onComplete={handleLessonComplete}
                          selectedLanguage={selectedLanguage}
                        />
                      </div>
                      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>{getTranslatedText('Duration:', selectedLanguage)} {currentLesson.duration} {getTranslatedText('minutes', selectedLanguage)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span>{getTranslatedText('Video Lesson', selectedLanguage)}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() => {
                                // Handle YouTube start for video lessons
                                const videoPlayerElement = document.querySelector('iframe[src*="youtube.com"]');
                                if (videoPlayerElement) {
                                  // Trigger video start in VideoPlayer component
                                  window.dispatchEvent(new CustomEvent('startVideo'));
                                }
                              }}
                              className="bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                              size="sm"
                            >
                              <Play className="h-4 w-4 mr-1" />
                              {getTranslatedText('Start Watching', selectedLanguage)}
                            </Button>
                            <Button
                              onClick={() => {
                                // Handle completion for video lessons
                                window.dispatchEvent(new CustomEvent('completeVideo'));
                              }}
                              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                              size="sm"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              {getTranslatedText('Mark as Complete', selectedLanguage)}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Content Sections */}
                    {getLocalizedContent(currentLesson.content || '', selectedLanguage)
                      .split(/\n\s*\n/)
                      .filter(Boolean)
                      .map((chunk, idx) => (
                        <div key={`content-${idx}`} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                <BookOpen className="h-4 w-4 text-gray-600" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">{getTranslatedText('Key Concepts', selectedLanguage)}</h3>
                                <p className="text-gray-600 text-sm">{getTranslatedText('Important information to understand', selectedLanguage)}</p>
                              </div>
                              <div className="ml-auto">
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                  {selectedLanguage}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="p-6">
                            <div className="prose prose-lg max-w-none">
                              {chunk.split('\n').map((line, lineIdx) => {
                                if (line.trim().startsWith('# ')) {
                                  return (
                                    <h1 key={lineIdx} className="text-2xl font-bold text-gray-900 mb-4 mt-6 first:mt-0">
                                      {line.replace('# ', '')}
                                    </h1>
                                  )
                                } else if (line.trim().startsWith('## ')) {
                                  return (
                                    <h2 key={lineIdx} className="text-xl font-semibold text-gray-800 mb-3 mt-5">
                                      {line.replace('## ', '')}
                                    </h2>
                                  )
                                } else if (line.trim().startsWith('- ')) {
                                  return (
                                    <div key={lineIdx} className="flex items-start gap-3 mb-2">
                                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                      <p className="text-gray-700 leading-relaxed">{line.replace('- ', '')}</p>
                                    </div>
                                  )
                                } else if (line.trim()) {
                                  return (
                                    <p key={lineIdx} className="text-gray-700 leading-relaxed mb-3">
                                      {line}
                                    </p>
                                  )
                                }
                                return null
                              })}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}

                {currentLesson.type === 'quiz' && (
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Trophy className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{getTranslatedText('Quick Check', selectedLanguage)}</h3>
                          <p className="text-gray-600 text-sm">{getTranslatedText('Test your understanding of this lesson', selectedLanguage)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <QuizInterface
                        quizId={currentLesson.id}
                        onComplete={handleQuizComplete}
                      />
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                  <Button
                    variant="outline"
                    onClick={previousLesson}
                    disabled={currentModuleIndex === 0 && currentLessonIndex === 0}
                    className="flex items-center gap-2 hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>{getTranslatedText('Previous', selectedLanguage)}</span>
                    <span className="text-xs text-gray-400 ml-2">←</span>
                  </Button>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <span>{getTranslatedText('Keyboard shortcuts:', selectedLanguage)}</span>
                      <div className="flex items-center gap-1">
                        <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">←</kbd>
                        <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">→</kbd>
                        <span className="text-xs">{getTranslatedText('Navigate', selectedLanguage)}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={nextLesson}
                    disabled={currentModuleIndex === course.modules.length - 1 && 
                             currentLessonIndex === course.modules[currentModuleIndex].lessons.length - 1}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    <span>{getTranslatedText('Next', selectedLanguage)}</span>
                    <ChevronRight className="h-4 w-4" />
                    <span className="text-xs text-blue-200 ml-2">→</span>
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Course Sidebar */}
          <div className="space-y-6">
            {/* Course Info */}
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  {getTranslatedText('Course Modules', selectedLanguage)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {course.modules.map((module, moduleIndex) => (
                  <div key={module.id} className="space-y-2">
                    <h4 className="font-medium">{module.title}</h4>
                    <div className="space-y-1">
                      {module.lessons.map((lesson, lessonIndex) => {
                        const isCompleted = isLessonCompleted(moduleIndex, lessonIndex)
                        const canAccess = canAccessLesson(moduleIndex, lessonIndex)
                        const isCurrent = currentModuleIndex === moduleIndex && currentLessonIndex === lessonIndex

                        return (
                          <Button
                            key={lesson.id}
                            variant={isCurrent ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => navigateToLesson(moduleIndex, lessonIndex)}
                            disabled={!canAccess}
                            className={`w-full justify-start h-auto p-3 transition-all duration-200 ${
                              isCurrent 
                                ? 'bg-blue-600 text-white shadow-md' 
                                : isCompleted 
                                  ? 'bg-green-50 border-green-200 hover:bg-green-100' 
                                  : canAccess
                                    ? 'hover:bg-gray-50 hover:shadow-sm'
                                    : 'opacity-50 cursor-not-allowed'
                            }`}
                          >
                            <div className="flex items-center gap-3 w-full">
                              {lesson.type === 'video' ? (
                                <Play className={`h-4 w-4 ${isCurrent ? 'text-white' : 'text-blue-600'}`} />
                              ) : (
                                <Trophy className={`h-4 w-4 ${isCurrent ? 'text-white' : 'text-yellow-600'}`} />
                              )}
                              <div className="flex-1 text-left">
                                <div className={`text-sm font-medium ${isCurrent ? 'text-white' : 'text-gray-900'}`}>
                                  {lesson.title}
                                </div>
                                <div className={`text-xs ${isCurrent ? 'text-blue-100' : 'text-gray-500'}`}>
                                  {lesson.duration} min
                                </div>
                              </div>
                              {isCompleted && (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              )}
                              {isCurrent && (
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                              )}
                            </div>
                          </Button>
                        )
                      })}
                    </div>
                    {moduleIndex < course.modules.length - 1 && (
                      <Separator className="my-2" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Progress Stats */}
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  {getTranslatedText('Your Progress', selectedLanguage)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {progress?.completedLessons.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">{getTranslatedText('Completed', selectedLanguage)}</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {totalLessons}
                    </div>
                    <div className="text-sm text-gray-600">{getTranslatedText('Total', selectedLanguage)}</div>
                  </div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-lg font-bold text-purple-600">
                    {(() => {
                      // Calculate realistic time based on completed lessons using actual durations
                      if (!course || !progress) return '0h 0m'
                      
                      let totalMinutes = 0
                      course.modules.forEach(module => {
                        module.lessons.forEach(lesson => {
                          if (progress.completedLessons.includes(lesson.id)) {
                            totalMinutes += lesson.duration
                          }
                        })
                      })
                      
                      const hours = Math.floor(totalMinutes / 60)
                      const minutes = totalMinutes % 60
                      
                      return `${hours}h ${minutes}m`
                    })()}
                  </div>
                  <div className="text-sm text-gray-600">{getTranslatedText('Time Spent', selectedLanguage)}</div>
                </div>
                
                {/* Overall progress bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{getTranslatedText('Overall Progress', selectedLanguage)}</span>
                    <span className="text-gray-600">{Math.round(getOverallProgress())}%</span>
                  </div>
                  <Progress value={getOverallProgress()} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}