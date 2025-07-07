# EquipIQ Quick Reference Guide

**Last Updated**: 2025-01-27

## 📁 Documentation Overview

### What Each File Contains

1. **[PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md)**
   - Complete project overview
   - Current database status (20/26 tables implemented)
   - Tech stack and architecture decisions
   - Implementation phases
   - Guidelines for AI assistants
   - **Use this**: When starting a new AI chat session

2. **[PROGRESS.md](./PROGRESS.md)**
   - ✅ Completed features checklist
   - 🚧 Work in progress
   - 📋 To-do items by priority
   - Known issues tracker
   - **Update this**: After each Lovable work session

3. **[PROMPTS.md](./PROMPTS.md)**
   - Tested Lovable.dev prompts that work
   - Organized by category (fixes, features, UI, etc.)
   - Copy-paste ready commands
   - **Use this**: When working in Lovable

4. **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)**
   - Common issues and their solutions
   - Quick fix commands
   - Emergency recovery steps
   - **Check this**: When something breaks

## 🎯 How to Use This Documentation

### For AI Assistants (Claude, ChatGPT, etc.)
Start every conversation with:
```
Please read the project documentation at:
https://github.com/ambriah83/equip-iq/blob/main/PROJECT_CONTEXT.md

This contains all project context, current status, and guidelines.
```

### For Lovable.dev
1. Use prompts from PROMPTS.md
2. Reference files in your prompts:
   ```
   See PROJECT_CONTEXT.md in the repository for project details.
   Update PROGRESS.md after making these changes.
   ```

### For Yourself
1. **Before starting work**: Check PROGRESS.md for where you left off
2. **During work**: Use PROMPTS.md for proven commands
3. **When stuck**: Check TROUBLESHOOTING.md
4. **After work**: Update PROGRESS.md with what you accomplished

## 📝 Quick Links

Save these bookmarks:
- **Full Context**: https://github.com/ambriah83/equip-iq/blob/main/PROJECT_CONTEXT.md
- **Current Progress**: https://github.com/ambriah83/equip-iq/blob/main/PROGRESS.md
- **Working Prompts**: https://github.com/ambriah83/equip-iq/blob/main/PROMPTS.md
- **Fix Issues**: https://github.com/ambriah83/equip-iq/blob/main/TROUBLESHOOTING.md

## 🚀 Current Status Summary

### ✅ What's Working
- Basic authentication
- Equipment management (CRUD)
- Location management
- Vendor tracking
- AI chat interface
- File uploads

### 🚧 In Progress
- Ticket system UI (structure done, needs interface)
- Repository reorganization (fixing import paths)
- Dashboard real data integration

### 📋 Next Priorities
1. Fix import path errors
2. Create ticket UI
3. Connect dashboard to real data
4. Add documents table

## 💡 Remember

- **No coding experience needed** - Lovable does the coding
- **One feature at a time** - Don't overwhelm Lovable
- **Test after each change** - Make sure nothing broke
- **Update documentation** - Keep PROGRESS.md current

## 🆘 Emergency Contacts

- **Lovable Project**: https://lovable.dev/projects/1bbe4a9f-b017-44d9-91ea-5a7ba7705cdc
- **GitHub Repo**: https://github.com/ambriah83/equip-iq
- **Database Schema**: [Google Doc](https://docs.google.com/document/d/1DhM5KVtlYUXUcGHewGPeHRF64uHluzSVaKqQJSdNoC4/edit)
