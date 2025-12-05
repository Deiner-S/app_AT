import SqlitePersonDAO from "./DAO/SqlitePersonDAO";


async function main() {
    
    const dao = await SqlitePersonDAO.build();

    console.log("Criando pessoa...");
    await dao.create({ name: "Deiner", age: 28 });

    console.log("Lendo pessoa id 1...");
    const p = await dao.read(1);
    console.log("Resultado:", p);

    console.log("Atualizando pessoa id 1...");
    await dao.update(1, { name: "Deiner Atualizado", age: 29 });

    console.log("Lendo novamente...");
    const p2 = await dao.read(1);
    console.log("Resultado:", p2);

    console.log("Deletando id 1...");
    await dao.delete(1);

    console.log("Lendo após delete...");
    const p3 = await dao.read(1);
    console.log("Resultado:", p3);
}

main();
