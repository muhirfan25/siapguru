sed -i '/{\/\* Overview Stat Cards \*\//i\
      {/* Welcome Banner */}\
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">\
        <div className="relative z-10">\
          <h2 className="text-3xl font-extrabold mb-2">\
            Selamat Datang, {userName || (userRole === "admin" ? "Admin" : "Guru")}! 👋\
          </h2>\
          <p className="text-indigo-100 text-lg font-medium">\
            Anda login sebagai <span className="font-bold bg-white/20 px-2 py-1 rounded-lg ml-1">{userRole === "admin" ? "Administrator" : "Guru"}</span>\
          </p>\
        </div>\
        <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-20">\
          <Sparkles className="w-64 h-64" />\
        </div>\
      </div>\
' src/components/DashboardView.tsx
