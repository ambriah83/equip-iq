
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Download, Wand2 } from 'lucide-react';

interface GeneratedLogo {
  id: number;
  prompt: string;
  image: string;
  style: string;
  concept: string;
  colors: string;
}

const LogoGeneratorTab = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLogos, setGeneratedLogos] = useState<GeneratedLogo[]>([]);
  const [style, setStyle] = useState('modern');
  const [colors, setColors] = useState('blue and teal');
  const [concept, setConcept] = useState('equipment management');

  const handleGenerateLogos = async () => {
    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-logo', {
        body: {
          style,
          colors,
          concept
        }
      });

      if (error) {
        throw error;
      }

      if (data.success && data.logos) {
        setGeneratedLogos(data.logos);
        toast({
          title: "Logos Generated Successfully",
          description: `Generated ${data.count} logo options for EquipIQ.`,
        });
      } else {
        throw new Error(data.error || 'Failed to generate logos');
      }
    } catch (error) {
      console.error('Error generating logos:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate logo options. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadLogo = (logo: GeneratedLogo) => {
    const link = document.createElement('a');
    link.href = logo.image;
    link.download = `equipiq-logo-${logo.id}-${logo.style}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Logo Downloaded",
      description: `Logo ${logo.id} downloaded successfully.`,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            AI Logo Generator
          </CardTitle>
          <CardDescription>
            Generate professional logo options for EquipIQ using AI. Customize the style, colors, and concept to match your brand vision.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="style">Style</Label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger>
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="minimalist">Minimalist</SelectItem>
                  <SelectItem value="tech">Tech-focused</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
                  <SelectItem value="corporate">Corporate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="colors">Color Scheme</Label>
              <Input
                id="colors"
                value={colors}
                onChange={(e) => setColors(e.target.value)}
                placeholder="e.g., blue and teal"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="concept">Concept Focus</Label>
              <Select value={concept} onValueChange={setConcept}>
                <SelectTrigger>
                  <SelectValue placeholder="Select concept" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equipment management">Equipment Management</SelectItem>
                  <SelectItem value="AI technology">AI Technology</SelectItem>
                  <SelectItem value="maintenance platform">Maintenance Platform</SelectItem>
                  <SelectItem value="smart monitoring">Smart Monitoring</SelectItem>
                  <SelectItem value="industrial IoT">Industrial IoT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleGenerateLogos}
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Logos...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate Logo Options
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {generatedLogos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Logos</CardTitle>
            <CardDescription>
              Here are your AI-generated logo options. Click download to save any logo you like.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {generatedLogos.map((logo) => (
                <div key={logo.id} className="border rounded-lg p-4 space-y-3">
                  <div className="aspect-square bg-gray-50 rounded-lg flex items-center justify-center p-4">
                    <img
                      src={logo.image}
                      alt={`EquipIQ Logo Option ${logo.id}`}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Logo Option {logo.id}</div>
                    <div className="text-xs text-gray-600">
                      Style: {logo.style} | Colors: {logo.colors}
                    </div>
                    <Button
                      onClick={() => downloadLogo(logo)}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download PNG
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Usage Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• Each generation creates 4 different logo variations</p>
            <p>• Logos are generated with transparent backgrounds</p>
            <p>• High-quality PNG format suitable for web and print</p>
            <p>• Try different color schemes and styles for variety</p>
            <p>• Cost: approximately $0.16 per generation (4 logos)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LogoGeneratorTab;
