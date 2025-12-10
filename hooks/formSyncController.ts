import Form from "@/models/Form";
import SqliteFormDAO from "@/services/SQLiteFormDAO";

export default function formSyncController(formDAO:SqliteFormDAO | null){

    const sincData = async () => {  
        console.log("sincData")  
        if (!formDAO) return;
        const rows = await formDAO.readAll();
        for (const row of rows) {
            if(row.sinc === 0){
                console.log("Registros:", JSON.stringify(row, null, 2));            
                
                const response = await tryCallAPI(row);
                if (!response || !response.ok) {
                    console.error("Erro ao sincronizar:", row.id);
                    continue; 
                }

                row.sinc = 1
                await formDAO.update(Number(row.id), row);
                console.log(`Registro ${row.id} sincronizado com sucesso!`);           

            };
        };
    };

    const tryCallAPI = async (row:Form) =>{
        try{
            const response = await callAPI(row);
            return response

        }catch (error) {
            console.error("Falha na requisição:", error);
        }
    }

    const callAPI = async (row:Form) =>{
        
        const { sinc,id, ...payload } = row;
        const response = await fetch("http://10.0.2.2:8000/api/people/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },                
            body: JSON.stringify(payload),
        });

        return response  
    }
    return {
        sincData
    }
}
