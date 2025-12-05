import { useState, useRef } from "react";
import { menuItems } from "@/data/menuItems";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { themeStyles } from "@/types/theme";
import { toPng } from 'html-to-image';
import { Button } from "@/components/ui/button";
import { Download, FileType, ArrowLeft, Shuffle } from "lucide-react";
import html2pdf from 'html2pdf.js';
import { useNavigate } from "react-router-dom";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import MenuPreview from "@/components/menu-generator/MenuPreview";

const MenuGenerator = () => {
  const [theme, setTheme] = useState('sushi');
  const [columns, setColumns] = useState(2);
  const [size, setSize] = useState('medium');
  const [spacing, setSpacing] = useState(4);
  const [titleColor, setTitleColor] = useState('');
  const [priceColor, setPriceColor] = useState('');
  const [descriptionColor, setDescriptionColor] = useState('');
  const [overlayColor, setOverlayColor] = useState('#000000');
  const [overlayOpacity, setOverlayOpacity] = useState(30);
  const [font, setFont] = useState('japanese');
  const { toast } = useToast();

  const categorizedItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  const [categories, setCategories] = useState(Object.keys(categorizedItems));
  const menuRef = useRef(null);
  const currentTheme = {
    ...themeStyles[theme],
    titleColor: titleColor || themeStyles[theme].titleColor,
    priceColor: priceColor || themeStyles[theme].priceColor,
    textColor: descriptionColor || themeStyles[theme].textColor,
  };
  const navigate = useNavigate();

  const randomizeGrid = () => {
    const shuffledCategories = [...categories].sort(() => Math.random() - 0.5);
    setCategories(shuffledCategories);
    toast({
      title: "¡Grid reorganizado!",
      description: "Las categorías han sido reorganizadas aleatoriamente.",
    });
  };

  const downloadMenu = async () => {
    if (menuRef.current === null) return;
    toast({
      title: "Generando imagen...",
      description: "Por favor espera mientras generamos tu menú.",
    });

    try {
      const dataUrl = await toPng(menuRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        cacheBust: true,
        includeQueryParams: true,
        skipAutoScale: true,
        style: {
          transform: 'none',
        },
        filter: (node) => {
          return !node.classList?.contains('fixed');
        },
        beforeDraw: (canvas) => {
          const context = canvas.getContext('2d');
          context.imageSmoothingEnabled = true;
          context.imageSmoothingQuality = 'high';
          return Promise.resolve();
        }
      });
      
      const link = document.createElement('a');
      link.download = `menu-${theme}.png`;
      link.href = dataUrl;
      link.click();

      toast({
        title: "¡Menú descargado!",
        description: "Tu menú ha sido descargado correctamente.",
      });
    } catch (error) {
      console.error('Error al generar la imagen:', error);
      toast({
        title: "Error",
        description: "Hubo un error al generar la imagen. Por favor intenta de nuevo.",
        variant: "destructive",
      });
    }
  };

  const downloadPDF = () => {
    if (menuRef.current === null) return;
    toast({
      title: "Generando PDF...",
      description: "Por favor espera mientras generamos tu menú.",
    });

    const opt = {
      margin: [10, 10],
      filename: `menu-${theme}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait',
      }
    };

    html2pdf().set(opt).from(menuRef.current).save()
      .then(() => {
        toast({
          title: "¡PDF descargado!",
          description: "Tu menú ha sido descargado correctamente en formato PDF.",
        });
      })
      .catch((error) => {
        console.error('Error al generar PDF:', error);
        toast({
          title: "Error",
          description: "Hubo un error al generar el PDF. Por favor intenta de nuevo.",
          variant: "destructive",
        });
      });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-background text-foreground">
        {/* Header */}
        <div className="fixed top-0 left-0 right-0 z-50">
          <div className="glass-container border-b border-border/20">
            <div className="max-w-7xl mx-auto p-4">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-2 items-center">
                  <Button 
                    onClick={() => navigate('/menu-manager')}
                    variant="outline"
                    className="text-foreground hover:bg-accent"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Volver
                  </Button>
                  
                  <Button 
                    onClick={downloadMenu}
                    variant="outline"
                    className="text-foreground hover:bg-accent"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    PNG
                  </Button>
                  
                  <Button 
                    onClick={downloadPDF}
                    variant="outline"
                    className="text-foreground hover:bg-accent"
                  >
                    <FileType className="w-4 h-4 mr-2" />
                    PDF
                  </Button>

                  <Button
                    onClick={randomizeGrid}
                    variant="outline"
                    className="text-foreground hover:bg-accent"
                  >
                    <Shuffle className="w-4 h-4 mr-2" />
                    Reorganizar
                  </Button>
                </div>

                <div className="flex flex-wrap gap-4 items-center">
                  <ThemeSwitcher 
                    currentTheme={theme} 
                    onThemeChange={setTheme}
                    onRandomizeGrid={randomizeGrid}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="fixed left-4 top-24 bottom-4 w-64 glass-container rounded-lg p-4 overflow-y-auto">
          <div className="space-y-6">
            <div>
              <Label className="text-foreground mb-2">Columnas</Label>
              <Select value={columns.toString()} onValueChange={(value) => setColumns(Number(value))}>
                <SelectTrigger className="bg-background/50 text-foreground border-border">
                  <SelectValue placeholder="Selecciona columnas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Columna</SelectItem>
                  <SelectItem value="2">2 Columnas</SelectItem>
                  <SelectItem value="3">3 Columnas</SelectItem>
                  <SelectItem value="4">4 Columnas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-foreground mb-2">Tamaño de texto</Label>
              <Select value={size} onValueChange={setSize}>
                <SelectTrigger className="bg-background/50 text-foreground border-border">
                  <SelectValue placeholder="Selecciona tamaño" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Pequeño</SelectItem>
                  <SelectItem value="medium">Mediano</SelectItem>
                  <SelectItem value="large">Grande</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-foreground mb-2">Color de títulos</Label>
              <Input
                type="color"
                value={titleColor || currentTheme.titleColor}
                onChange={(e) => setTitleColor(e.target.value)}
                className="w-full h-10 bg-background/50 border-border"
              />
            </div>

            <div>
              <Label className="text-foreground mb-2">Color de precios</Label>
              <Input
                type="color"
                value={priceColor || currentTheme.priceColor}
                onChange={(e) => setPriceColor(e.target.value)}
                className="w-full h-10 bg-background/50 border-border"
              />
            </div>

            <div>
              <Label className="text-foreground mb-2">Color de descripciones</Label>
              <Input
                type="color"
                value={descriptionColor || currentTheme.textColor}
                onChange={(e) => setDescriptionColor(e.target.value)}
                className="w-full h-10 bg-background/50 border-border"
              />
            </div>

            <div className="space-y-4">
              <Label className="text-foreground mb-2">Color del filtro de fondo</Label>
              <Input
                type="color"
                value={overlayColor}
                onChange={(e) => setOverlayColor(e.target.value)}
                className="w-full h-10 bg-background/50 border-border"
              />
            </div>

            <div className="space-y-4">
              <Label className="text-foreground mb-2">
                Intensidad del filtro ({overlayOpacity}%)
              </Label>
              <Slider
                value={[overlayOpacity]}
                onValueChange={([value]) => setOverlayOpacity(value)}
                min={0}
                max={100}
                step={1}
                className="my-4"
              />
            </div>

            {/* Fuente General - Nueva herramienta al final */}
            <div>
              <Label className="text-foreground mb-2">Fuente General</Label>
              <Select value={font} onValueChange={setFont}>
                <SelectTrigger className="bg-background/50 text-foreground border-border">
                  <SelectValue placeholder="Selecciona fuente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="japanese">Japonés</SelectItem>
                  <SelectItem value="italian">Italiano</SelectItem>
                  <SelectItem value="western">Western</SelectItem>
                  <SelectItem value="nautical">Náutico</SelectItem>
                  <SelectItem value="fiesta">Fiesta</SelectItem>
                  <SelectItem value="nature">Naturaleza</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="pt-20 pl-72 pr-4 pb-4">
          <MenuPreview 
            menuRef={menuRef}
            opacity={0.8}
            currentTheme={currentTheme}
            categories={categories}
            categorizedItems={categorizedItems}
            columns={columns}
            size={size}
            spacing={spacing}
            font={font}
            overlayColor={overlayColor}
            overlayOpacity={overlayOpacity}
          />
        </div>
      </div>
    </DndProvider>
  );
};

export default MenuGenerator;
