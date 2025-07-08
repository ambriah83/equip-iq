-- Create enums for inventory management
CREATE TYPE movement_type AS ENUM ('purchase', 'usage', 'adjustment', 'transfer');
CREATE TYPE reference_type AS ENUM ('ticket', 'purchase_order', 'manual');

-- Create inventory_categories table
CREATE TABLE public.inventory_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create inventory_items table
CREATE TABLE public.inventory_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  part_number TEXT UNIQUE,
  category_id UUID NOT NULL REFERENCES public.inventory_categories(id) ON DELETE RESTRICT,
  description TEXT,
  manufacturer TEXT,
  min_stock INTEGER DEFAULT 0,
  max_stock INTEGER,
  reorder_point INTEGER DEFAULT 0,
  unit_cost NUMERIC(10,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create inventory_stock table
CREATE TABLE public.inventory_stock (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID NOT NULL REFERENCES public.inventory_items(id) ON DELETE CASCADE,
  location_id UUID NOT NULL REFERENCES public.locations(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 0,
  last_counted TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(item_id, location_id)
);

-- Create inventory_movements table
CREATE TABLE public.inventory_movements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID NOT NULL REFERENCES public.inventory_items(id) ON DELETE CASCADE,
  location_id UUID NOT NULL REFERENCES public.locations(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  movement_type movement_type NOT NULL,
  reference_id UUID,
  reference_type reference_type NOT NULL,
  notes TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.inventory_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for inventory_categories
CREATE POLICY "Users can view all inventory categories" 
ON public.inventory_categories 
FOR SELECT 
USING (true);

CREATE POLICY "Users can manage inventory categories for accessible locations" 
ON public.inventory_categories 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM user_location_access 
  WHERE user_id = auth.uid() 
  AND access_level IN ('write', 'admin')
));

-- Create RLS policies for inventory_items
CREATE POLICY "Users can view all inventory items" 
ON public.inventory_items 
FOR SELECT 
USING (true);

CREATE POLICY "Users can manage inventory items for accessible locations" 
ON public.inventory_items 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM user_location_access 
  WHERE user_id = auth.uid() 
  AND access_level IN ('write', 'admin')
));

-- Create RLS policies for inventory_stock
CREATE POLICY "Users can view inventory stock for their locations" 
ON public.inventory_stock 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM user_location_access 
  WHERE user_id = auth.uid() 
  AND location_id = inventory_stock.location_id
));

CREATE POLICY "Users can manage inventory stock for locations they have write access" 
ON public.inventory_stock 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM user_location_access 
  WHERE user_id = auth.uid() 
  AND location_id = inventory_stock.location_id 
  AND access_level IN ('write', 'admin')
));

-- Create RLS policies for inventory_movements
CREATE POLICY "Users can view inventory movements for their locations" 
ON public.inventory_movements 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM user_location_access 
  WHERE user_id = auth.uid() 
  AND location_id = inventory_movements.location_id
));

CREATE POLICY "Users can create inventory movements for locations they have write access" 
ON public.inventory_movements 
FOR INSERT 
WITH CHECK (
  auth.uid() = created_by 
  AND EXISTS (
    SELECT 1 FROM user_location_access 
    WHERE user_id = auth.uid() 
    AND location_id = inventory_movements.location_id 
    AND access_level IN ('write', 'admin')
  )
);

CREATE POLICY "Users can update inventory movements they created" 
ON public.inventory_movements 
FOR UPDATE 
USING (created_by = auth.uid());

-- Create indexes for better performance
CREATE INDEX idx_inventory_items_category ON public.inventory_items(category_id);
CREATE INDEX idx_inventory_items_part_number ON public.inventory_items(part_number);
CREATE INDEX idx_inventory_stock_item_location ON public.inventory_stock(item_id, location_id);
CREATE INDEX idx_inventory_stock_location ON public.inventory_stock(location_id);
CREATE INDEX idx_inventory_movements_item ON public.inventory_movements(item_id);
CREATE INDEX idx_inventory_movements_location ON public.inventory_movements(location_id);
CREATE INDEX idx_inventory_movements_created_by ON public.inventory_movements(created_by);
CREATE INDEX idx_inventory_movements_created_at ON public.inventory_movements(created_at);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_inventory_categories_updated_at
BEFORE UPDATE ON public.inventory_categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_inventory_items_updated_at
BEFORE UPDATE ON public.inventory_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_inventory_stock_updated_at
BEFORE UPDATE ON public.inventory_stock
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();