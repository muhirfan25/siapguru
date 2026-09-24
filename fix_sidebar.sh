#!/bin/bash
sed -i 's/isOpen={sidebarOpen}/sidebarOpen={sidebarOpen}/' src/App.tsx
sed -i 's/setIsOpen={setSidebarOpen}/setSidebarOpen={setSidebarOpen}/' src/App.tsx
