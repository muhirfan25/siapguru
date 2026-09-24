#!/bin/bash
# Remove "Email Admin (Superadmin: pbmirfan81@gmail.com)"
sed -i "s/{role === 'guru' ? 'NIP Guru' : 'Email Admin (Superadmin: pbmirfan81@gmail.com)'}/{role === 'guru' ? 'NIP Guru' : 'Email Admin'}/g" src/components/LoginView.tsx
