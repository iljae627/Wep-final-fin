# Memory Forensics Study

## 핵심 정리
Volatility로 memory image를 분석하고 timeline, registry artifact, malware incident evidence를 정리했다.

## 키워드
- forensics
- memory
- volatility
- artifact
- timeline
- registry
- incident

## 실습 메모
```bash
vol.py -f memory.raw windows.pslist
vol.py -f memory.raw windows.netscan
```
