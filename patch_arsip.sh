sed -i 's/a.url,/"Klik untuk Buka Tautan",/g' src/components/PusatLaporanView.tsx

cat << 'INNER' > sed_script.sed
/columnStyles: { 3: { cellWidth: 80 } }/c\
        columnStyles: { 3: { cellWidth: 50, textColor: [37, 99, 235] } },\
        didDrawCell: (data) => {\
          if (data.section === "body" && data.column.index === 3) {\
            const url = filteredArsip[data.row.index].url;\
            if (url) {\
              (doc as any).link(data.cell.x, data.cell.y, data.cell.width, data.cell.height, { url: url });\
            }\
          }\
        }
INNER
sed -i -f sed_script.sed src/components/PusatLaporanView.tsx
