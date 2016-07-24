import hashlib
import base64
import sys

# to generate tests
def hash(s):
    hash = hashlib.sha256(s.encode()).digest()
    encoded = base64.b64encode(hash)
    return encoded

contents = sys.stdin.read()
print(hash(contents))
