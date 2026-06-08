# Pwnable ROP Practice

## 학습 내용
buffer overflow, stack canary, libc leak, ROP chain, shellcode exploit 과정을 gdb와 pwndbg로 분석했다.

## 체크리스트
- stack 구조 확인
- canary leak
- libc base 계산
- system('/bin/sh') 호출

```python
payload = b'A' * 72 + p64(pop_rdi) + p64(binsh) + p64(system)
```
