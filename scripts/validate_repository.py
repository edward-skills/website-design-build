#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Dependency-free packaging checks; does not certify generated website quality."""
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
SKILL = ROOT / 'website-design-build'
errors = []
entry = SKILL / 'SKILL.md'
text = entry.read_text(encoding='utf8')
match = re.match(r'\A---\n(.*?)\n---\n', text, re.S)
if not match:
    errors.append('SKILL.md requires YAML frontmatter')
else:
    fields = dict(re.findall(r'^([a-z-]+):\s*(.+)$', match.group(1), re.M))
    name = fields.get('name', '')
    if name != SKILL.name or not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', name) or len(name) > 64:
        errors.append('Skill name must match its directory and standard naming rules')
    if not 1 <= len(fields.get('description', '')) <= 1024:
        errors.append('Description must be present and within the standard limit')
    if 'LICENSE.txt' not in fields.get('license', ''):
        errors.append('Skill license must refer to the bundled terms')
if (ROOT/'LICENSE').read_bytes() != (SKILL/'LICENSE.txt').read_bytes():
    errors.append('Repository and installed Skill license differ')

for p in ROOT.rglob('*'):
    if not p.is_file() or '.git' in p.relative_to(ROOT).parts:
        continue
    if p.suffix.lower() not in {'.md', '.txt', '.yaml', '.yml', '.py', '.html', '.css', '.js', '.json'}:
        continue
    data = p.read_text(encoding='utf8')
    if p.suffix.lower() == '.md':
        for target in re.findall(r'\]\(([^)]+)\)', data):
            if target.startswith(('https://', 'http://', 'mailto:', '#')):
                continue
            path = target.split('#')[0].strip('<>')
            if path and not (p.parent/path).is_file() and not (p.parent/path).is_dir():
                errors.append(f'{p.relative_to(ROOT)}: missing link {target}')
        for target in re.findall(r'(?:src|href)="([^"]+)"', data):
            if not target.startswith(('https://','http://','#')) and not (p.parent/target).exists():
                errors.append(f'{p.relative_to(ROOT)}: missing HTML reference {target}')
    # Never publish local owner paths, private chat links or hosting identifiers.
    forbidden = ['/'+'Users/', 'codex:'+'//threads/', 'appgprj'+'_', 'appgdep'+'_']
    if any(value in data for value in forbidden):
        errors.append(f'{p.relative_to(ROOT)}: local/private provenance leaked')

required = ['README.md','README.en.md','NOTICE.md','docs/usage.md','docs/validation.md',
            'docs/images/gather-home.png','docs/images/gather-pricing.png',
            'docs/images/gather-login.png','docs/images/evenform-home.png',
            'examples/gather/dist/index.html','examples/gather/dist/pricing/index.html',
            'examples/gather/dist/login/index.html','examples/evenform/dist/index.html']
for item in required:
    if not (ROOT/item).is_file():
        errors.append(f'Missing required repository artifact: {item}')
if errors:
    print('\n'.join(errors), file=sys.stderr)
    sys.exit(1)
print('PASS: Skill entrypoint, bundled license, references, visual examples and portable repository paths.')
print('This is packaging validation; see docs/validation.md for production and browser evidence.')
