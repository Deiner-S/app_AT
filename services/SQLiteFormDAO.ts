class Pessoa {

  nome: string;
  idade: number;
  ativo: boolean;

  constructor(nome: string,idade: number, ativo: boolean) {
    this.nome = nome;
    this.idade = idade;
    this.ativo = ativo;
  }

  dizerOla(): string {
    return `Oi, eu sou ${this.nome}!`;
  }

  envelhecer(): void {
    this.idade += 1;
  }
}