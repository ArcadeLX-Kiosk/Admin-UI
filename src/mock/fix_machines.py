import re

with open('src/mock/machineData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# We need to add the missing properties to each machine object.
# The properties are: serialNumber, qrCode, hardwareFingerprint, firmwareVersion, activationDate, manufactureDate, warrantyExpiry, updatedAt
# Since we just generated these machines, we can append these properties to all objects.

def repl(match):
    obj = match.group(0)
    # Don't add if already exists
    if 'serialNumber' in obj:
        return obj
    
    # Extract machineCode for deriving some unique values
    mc_match = re.search(r"machineCode:\s*'([^']+)'", obj)
    mc = mc_match.group(1) if mc_match else 'KSK'
    
    append = f'''
    serialNumber: 'SN-{mc}',
    qrCode: 'QR-{mc}',
    hardwareFingerprint: 'HWF-{mc}',
    firmwareVersion: '1.2.0',
    activationDate: '2026-01-15T00:00:00Z',
    manufactureDate: '2025-12-01T00:00:00Z',
    warrantyExpiry: '2027-12-01T00:00:00Z',
    updatedAt: '2026-08-20T00:00:00Z','''
    
    # Insert right before the last closing brace
    return obj.rsplit('}', 1)[0] + append + '\n  }'

new_content = re.sub(r'\{\s*id:\s*\'[^\']+\'[^}]+totalTransactions:[^}]+\}', repl, content)

with open('src/mock/machineData.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)
