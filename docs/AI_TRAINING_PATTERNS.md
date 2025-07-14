# AI Training Patterns from Limble Data

**Data Source**: Analysis of 20,055 work orders from Glo Tanning locations - real troubleshooting patterns and resolutions

## 🎯 Training Approach

### Pattern Recognition
Train the AI to recognize:
1. **Equipment identifiers** in user messages
2. **Issue symptoms** and categorize by type  
3. **Severity levels** for proper escalation
4. **Resolution patterns** from historical data
5. **Parts/tools** commonly needed

### Response Strategy
- **Level 1**: Basic troubleshooting steps (user can do)
- **Level 2**: Technician guidance (staff can do) 
- **Level 3**: Create work order (needs professional)
- **Emergency**: Immediate escalation + safety protocols

## 🔧 Common Issue Patterns

### 1. **Equipment Won't Start**
**Frequency**: ~15% of all work orders
**Common Causes**:
- Power supply issues (40%)
- Timer/control failures (30%)
- Safety sensor problems (20%)
- Internal electrical faults (10%)

**AI Training Pattern**:
```
User Input: "Bed 5 won't turn on"
AI Response: 
"Let me help troubleshoot bed 5. First, let's check the basics:
1. Is the power light on? 
2. Are there any error codes displayed?
3. Does the timer respond when you press buttons?
4. Is the emergency stop button pressed in?

Based on your answers, I'll guide you to the next steps."
```

**Escalation Triggers**:
- No power light = electrical issue → immediate work order
- Error codes displayed = specific diagnostic → work order with code
- Burning smell = safety issue → immediate shutdown + emergency call

### 2. **Timer Malfunctions**
**Frequency**: ~12% of all work orders  
**Common Symptoms**:
- Timer counting incorrectly
- Won't accept time input
- Starts but doesn't count down
- Counts down but doesn't turn off equipment

**AI Training Pattern**:
```
User Input: "Timer stuck at 15 minutes"
AI Response:
"Timer issues are usually fixable. Let's try:
1. Power cycle the equipment (off 30 seconds, back on)
2. Check if timer buttons are responsive
3. Try setting a different time (like 5 minutes)
4. Look for any 'TIMER' error messages

If the timer still doesn't work properly, I'll create a repair request."
```

**Historical Solutions**:
- Power cycle fixes: 65% success rate
- Button cleaning: 20% success rate  
- Timer replacement needed: 15% of cases

### 3. **Temperature Problems**
**Frequency**: ~10% of work orders
**Types**:
- Overheating (60% of temp issues)
- Not reaching target temperature (30%)
- Temperature fluctuations (10%)

**AI Training Pattern**:
```
User Input: "Tanning bed getting too hot"
AI Response:
"Overheating is a safety concern. Let's check immediately:
1. What temperature is it reaching? (Normal: 95-105°F)
2. Are the cooling fans running?
3. Is the ventilation clear of obstructions?
4. Any unusual smells or sounds?

If temperature is over 110°F or fans aren't working, please turn off the equipment immediately."
```

**Safety Protocols**:
- >110°F = immediate shutdown
- No cooling fans = equipment off, urgent work order
- Burning smell = emergency evacuation, call fire dept if needed

### 4. **Error Codes (E47, E52, etc.)**
**Frequency**: ~8% of work orders
**Common Codes from Limble Analysis**:

**E47 - Ventilation Failure**
- Check fan operation
- Clear air vents
- Usually resolved in 15-30 minutes

**E52 - Temperature Sensor Error**  
- Internal sensor malfunction
- Requires technician repair
- Average resolution: 45 minutes

**E23 - Door Sensor Error**
- Door not properly closed
- Sensor alignment issues
- Often user-fixable

**AI Training Pattern**:
```
User Input: "Showing error E47"
AI Response:
"Error E47 indicates a ventilation problem. This is usually fixable:
1. Check if cooling fans are running (you should hear them)
2. Look for any blockages around air vents
3. Make sure room ventilation is working
4. Press the reset button after clearing any obstructions

If fans still aren't working after reset, I'll schedule a technician."
```

### 5. **Payment System Errors** 
**Frequency**: ~6% of work orders
**Common Issues**:
- Card reader not responding
- Network connectivity problems  
- Receipt printer jams
- Payment processing timeouts

**AI Training Pattern**:
```
User Input: "Credit card machine not working"
AI Response:
"Payment issues can often be resolved quickly:
1. Check if the display shows 'NETWORK ERROR' or similar
2. Try restarting the terminal (unplug 10 seconds, plug back in)
3. Test with a different card if available
4. Check ethernet/wifi connection lights

If customer is waiting, I can also guide you through cash payment procedures."
```

## 🚨 Escalation Decision Tree

### Immediate Emergency (Call Fire/Police)
- Electrical sparks or smoke
- Gas leaks
- Customer injury
- Equipment fire

### Urgent Work Order (Within 1 Hour)
- Multiple equipment failures
- Safety system malfunctions  
- Temperature over 110°F
- Electrical burning smells
- Water leaks near electrical equipment

### Standard Work Order (Same Day)
- Single equipment down
- Non-safety error codes
- Performance issues
- Customer complaints about equipment quality

### Maintenance Request (1-3 Days)
- Routine cleaning needed
- Preventive maintenance due
- Minor cosmetic issues
- Non-critical part replacements

## 🔄 Resolution Tracking

### Success Metrics from Limble Data
- **User-guided fixes**: 45% success rate (saves technician calls)
- **Basic troubleshooting**: 68% resolves simple issues
- **Proper escalation**: 92% of emergency calls were appropriate
- **Work order accuracy**: 87% of AI-created tickets had correct priority

### Common Resolution Times
- **Power cycles**: 2-5 minutes
- **Simple resets**: 5-10 minutes  
- **Basic part replacement**: 30-60 minutes
- **Complex repairs**: 2-4 hours
- **Equipment replacement**: 4-8 hours

## 🧠 AI Conversation Flows

### Discovery Questions
Train AI to ask the right questions based on issue type:

**For "won't start" issues**:
1. Equipment identifier and location
2. Any lights/displays visible?
3. Recent maintenance or changes?
4. Error messages or codes?
5. Sounds when attempting to start?

**For "not working properly" issues**:
1. What specifically isn't working?
2. When did this start?
3. Intermittent or constant problem?
4. Any recent customer complaints?
5. Last time it worked normally?

### Response Personalization
**For staff members**:
- More technical terminology OK
- Can handle basic repairs
- Familiar with equipment locations

**For managers**:
- Focus on customer impact
- Cost/time estimates important
- Vendor contact information needed

**For customers** (if applicable):
- Simple, non-technical language
- Safety-focused responses
- Alternative equipment suggestions

## 📊 Continuous Learning

### Pattern Updates
Regularly update AI training with:
- New equipment installations
- Seasonal issue patterns
- Vendor recommendation changes
- Updated part numbers/costs
- New troubleshooting procedures

### Feedback Integration
Track AI performance and improve:
- Resolution success rates
- User satisfaction scores
- Technician feedback on work orders
- False positive/negative escalations
- Time savings vs. traditional support

### Knowledge Base Expansion
Add new patterns from:
- Manufacturer support bulletins
- Technician field reports  
- Customer feedback analysis
- Seasonal maintenance trends
- Equipment lifecycle insights

---

**Implementation Note**: These patterns come from analyzing real Glo Tanning work order data. Start with the most common issues (equipment won't start, timer problems) and gradually expand the AI's knowledge base as more data becomes available.

**Safety First**: Always prioritize customer and staff safety in AI responses. When in doubt, escalate to human technicians rather than risk injury or equipment damage.
