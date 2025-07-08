-- Insert sample vendor data
INSERT INTO vendors (equipment_type, equipment_name, company_name, vendor_department, contact_name, phone, website_email, notes) VALUES
('Tanning Bed', 'SunMaster 3000', 'SunTech Solutions', 'Service Department', 'John Smith', '555-123-4567', 'service@suntech.com', 'Specializes in tanning bed maintenance and repairs'),
('HVAC', 'ThermoMax 500', 'Climate Control Pro', 'Technical Support', 'Sarah Johnson', '555-987-6543', 'support@climatecontrolpro.com', 'Emergency HVAC services available 24/7'),
('Lighting', 'LED Pro Series', 'BrightLight Systems', 'Sales Department', 'Mike Wilson', '555-456-7890', 'sales@brightlight.com', 'Energy-efficient lighting solutions'),
('Security', 'SecureView Cameras', 'Guardian Security', 'Installation Team', 'Lisa Davis', '555-321-0987', 'install@guardiansec.com', 'Complete security system installation and monitoring');

-- Insert sample vendor contacts
INSERT INTO vendor_contacts (vendor_id, contact_name, role, email, phone, is_primary) 
SELECT 
  v.id,
  v.contact_name,
  CASE 
    WHEN v.vendor_department = 'Service Department' THEN 'Service Manager'
    WHEN v.vendor_department = 'Technical Support' THEN 'Technical Support'
    WHEN v.vendor_department = 'Sales Department' THEN 'Sales Rep'
    WHEN v.vendor_department = 'Installation Team' THEN 'Installation Manager'
    ELSE 'Contact'
  END,
  v.website_email,
  v.phone,
  true
FROM vendors v;