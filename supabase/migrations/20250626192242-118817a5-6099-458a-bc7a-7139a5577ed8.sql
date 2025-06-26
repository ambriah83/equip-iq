
-- Update all location names to use "Glo Tanning" branding
UPDATE public.locations 
SET name = CASE 
  WHEN abbreviation = 'FL_Bradenton' THEN 'Glo Tanning - Bradenton'
  WHEN abbreviation = 'FL_PalmHarbor' THEN 'Glo Tanning - Palm Harbor'
  WHEN abbreviation = 'FL_Tampa' THEN 'Glo Tanning - Tampa'
  WHEN abbreviation = 'FL_BocaRaton' THEN 'Glo Tanning - Boca Raton'
  WHEN abbreviation = 'GA_Kennesaw' THEN 'Glo Tanning - Kennesaw'
  WHEN abbreviation = 'GA_Dallas' THEN 'Glo Tanning - Dallas'
  WHEN abbreviation = 'GA_Hiram' THEN 'Glo Tanning - Hiram'
  ELSE name
END
WHERE abbreviation IN ('FL_Bradenton', 'FL_PalmHarbor', 'FL_Tampa', 'FL_BocaRaton', 'GA_Kennesaw', 'GA_Dallas', 'GA_Hiram');
