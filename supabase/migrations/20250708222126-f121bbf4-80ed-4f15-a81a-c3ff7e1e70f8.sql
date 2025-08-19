-- Create volunteer_hours table to track completed volunteer work
CREATE TABLE public.volunteer_hours (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  organization TEXT NOT NULL,
  hours DECIMAL(5,2) NOT NULL CHECK (hours > 0),
  date_completed DATE NOT NULL,
  category TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.volunteer_hours ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own volunteer hours" 
ON public.volunteer_hours 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own volunteer hours" 
ON public.volunteer_hours 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own volunteer hours" 
ON public.volunteer_hours 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own volunteer hours" 
ON public.volunteer_hours 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_volunteer_hours_updated_at
BEFORE UPDATE ON public.volunteer_hours
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();