# Glo Tanning Equipment Reference

**Data Source**: Limble CMMS - 20,055 work orders, 1,168 assets, 940 parts from 38 active Glo locations

## 🎯 Equipment Categories

### 1. **Tanning Beds**
- **Norvell Auto Rev** (various models #1-50+)
- **Skin Wellness Pro** (SPA series)
- **Versa Pro** (spray tanning booths)
- **Traditional UV beds** (Level 1-5)

**Common Issues**:
- Won't start/power issues
- Timer malfunctions
- Temperature control problems
- Bulb replacement needed
- Fan not working

### 2. **Spray Tan Booths**
- **Norvell Booths** (Auto Rev series)
- **Versa Spa** (Pro models)
- **Mobile spray stations**

**Common Issues**:
- Solution not spraying
- Pressure problems
- Nozzle clogs
- Timer not working
- Door sensors malfunction

### 3. **Red Light Therapy Units**
- **LED panels** (various configurations)
- **Infrared therapy beds**
- **Collagen beds**

**Common Issues**:
- LED panels not lighting
- Uneven light distribution
- Timer issues
- Overheating problems

### 4. **HVAC Systems**
- **Exhaust fans** (for ventilation)
- **Air filtration** (UV bed ventilation)
- **Temperature control** (room climate)

**Common Issues**:
- Poor ventilation
- Overheating rooms
- Filter replacement
- Noise complaints

### 5. **POS Systems**
- **Payment terminals**
- **Membership card readers**
- **Receipt printers**

**Common Issues**:
- Payment processing errors
- Card reader malfunctions
- Network connectivity
- Printer paper jams

## 🏢 Location Hierarchy

### 38 Active Glo Locations
**States**: Texas (primary), Oklahoma, Florida, Arkansas

**Asset Naming Pattern**:
```
[Equipment Type] #[Number] [Location Code]
Example: "Norvell Auto Rev #27 MK" = Norvell bed #27 at McKinney location
```

**Location Codes** (examples from Limble data):
- MK = McKinney
- ALL = Allen  
- FRI = Frisco
- PLA = Plano
- [Full list in Limble system]

## 🔧 Maintenance Patterns

### High-Cost Assets (from Limble data)
1. **Skin Wellness Pro #27 MK** - $6,355 maintenance cost
2. **Skin Wellness #38 ALL** - $3,064 maintenance cost
3. **Various Norvell units** - $1,000-$3,000 range

### Common Work Order Types
- **Preventive Maintenance** (scheduled)
- **Emergency Repairs** (equipment down)
- **Bulb Replacements** (routine)
- **Filter Changes** (HVAC/UV beds)
- **Cleaning & Sanitization** (daily)

### Typical Resolution Times
- **Simple issues** (reset, minor adjustments): 5-15 minutes
- **Part replacement**: 30-60 minutes  
- **Complex repairs**: 2-4 hours
- **Equipment replacement**: Half/full day

## 🤖 AI Training Context

### Equipment Recognition Patterns
When users say:
- **"Bed 5 won't start"** → Identify specific tanning bed
- **"Norvell not working"** → Focus on spray tan booth issues
- **"Red light therapy down"** → LED/infrared equipment problems
- **"Room too hot"** → HVAC/ventilation issues
- **"Can't process payments"** → POS system problems

### Response Priorities
1. **Safety first** - Any electrical/overheating issues
2. **Customer impact** - Equipment affecting active customers
3. **Revenue impact** - Popular equipment vs. backup units
4. **Complexity** - Simple resets before calling technicians

### Escalation Triggers
**Immediate escalation** if:
- Electrical smells/sparks
- Overheating beyond normal ranges
- Customer injury potential
- Multiple units failing simultaneously

**Standard repair** for:
- Normal operational issues
- Routine maintenance alerts
- Single equipment problems
- Known issue patterns

## 📊 Equipment Data Fields (from Limble)

### Asset Information
- **Asset Name**: Full equipment identifier
- **Serial Number**: Manufacturer serial
- **Location**: Building > Room > Position
- **Purchase Date**: Install/warranty tracking
- **Model Number**: Specific equipment variant
- **Warranty Status**: Coverage remaining

### Work Order Fields
- **Task Description**: Issue details
- **Priority Level**: Low/Medium/High/Urgent
- **Assigned Technician**: Internal or vendor
- **Status**: Open/In Progress/Resolved/Closed
- **Time Estimate**: Expected completion
- **Actual Time**: Time to resolution
- **Parts Used**: Inventory tracking
- **Cost Breakdown**: Labor + Parts + External

### Parts Inventory
- **Part Name**: Description/model
- **Part Number**: Manufacturer ID
- **Quantity Available**: Current stock
- **Min/Max Levels**: Reorder thresholds
- **Cost**: Current pricing
- **Supplier**: Vendor information
- **Equipment Association**: Compatible with which assets

## 🎯 AI Response Guidelines

### For Tanning Bed Issues
```
"Let me help with your [specific bed model]. First, let's try these basic steps:
1. Check power connection and breaker
2. Verify timer settings
3. Look for any error codes on display
4. Check ventilation is clear

If this doesn't resolve it, I'll create a work order for a technician."
```

### For Spray Booth Problems
```
"Spray booth issues can often be resolved quickly. Let's check:
1. Solution levels in reservoir
2. Pressure gauge readings
3. Nozzle alignment and clogs
4. Customer area clear of obstructions

Based on your response, I'll either guide you through the fix or schedule a repair."
```

### For System-Wide Issues
```
"Multiple equipment problems suggest a building system issue. Let's check:
1. Main electrical panel
2. HVAC system status
3. Network connectivity
4. Environmental conditions (temperature, humidity)

I'm creating urgent work orders and notifying management."
```

## 📞 Vendor Contacts (Integration with Vendor Management)

### Equipment Manufacturers
- **Norvell**: Primary spray tan equipment
- **Skin Wellness**: Tanning bed manufacturer
- **[Other vendors in EquipIQ vendor database]**

### Service Technicians
- **Internal team**: Glo maintenance staff
- **Regional contractors**: Equipment service partners
- **Emergency services**: 24/7 repair companies

---

**Note**: This data comes from analyzing 20,055+ work orders from Glo Tanning's Limble system. Use this context to train the AI for accurate, equipment-specific responses.
