sed -i '1s/$/\nimport { getAuth } from "firebase\/auth";/' src/lib/firebase.ts
echo -e "\nexport const auth = getAuth(app);" >> src/lib/firebase.ts
