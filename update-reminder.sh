#!/bin/bash

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

clear

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                         EQUIP-IQ PROJECT UPDATE CHECKLIST                    ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}After any AI conversation or changes, complete this checklist:${NC}"
echo ""
echo -e "${GREEN}📝 Documentation Updates:${NC}"
echo -e "   [ ] ${YELLOW}PROGRESS.md${NC} - Add what was accomplished with today's date"
echo -e "   [ ] ${YELLOW}TROUBLESHOOTING.md${NC} - Document any new issues and fixes"
echo -e "   [ ] ${YELLOW}PROMPTS.md${NC} - Add successful commands (especially for Lovable.dev)"
echo -e "   [ ] ${YELLOW}CLAUDE.md${NC} - Review if architecture patterns changed"
echo ""
echo -e "${GREEN}💾 Version Control:${NC}"
echo -e "   [ ] ${YELLOW}git add .${NC} - Stage all changes"
echo -e "   [ ] ${YELLOW}git commit -m \"Description of changes\"${NC}"
echo -e "   [ ] ${YELLOW}git push${NC} - Push to GitHub repository"
echo ""
echo -e "${GREEN}🔍 Verification:${NC}"
echo -e "   [ ] Test the changes in the app"
echo -e "   [ ] Check that nothing broke"
echo -e "   [ ] Verify GitHub shows latest commit"
echo ""
echo -e "${RED}⚠️  Remember:${NC}"
echo -e "   - Update ${YELLOW}AI_INSTRUCTIONS.md${NC} header with who made changes"
echo -e "   - Keep commit messages descriptive"
echo -e "   - Document WHO made changes (Claude Code, Lovable, ChatGPT, etc.)"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}Quick Commands:${NC}"
echo ""
echo -e "  Update and push everything:"
echo -e "  ${YELLOW}git add . && git commit -m \"Update project documentation\" && git push${NC}"
echo ""
echo -e "  View recent changes:"
echo -e "  ${YELLOW}git status${NC}"
echo -e "  ${YELLOW}git diff${NC}"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"