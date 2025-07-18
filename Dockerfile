# Use uma imagem base oficial do Node.js
FROM node:22

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos de manifesto de pacotes
# Fazemos isso primeiro para aproveitar o cache do Docker.
# A instalação só será executada novamente se o package.json mudar.
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código-fonte da aplicação.
# Em desenvolvimento, o volume irá sobrepor isso, mas é útil para builds de produção.
COPY . .

# Expõe a porta que o servidor de desenvolvimento usa (ex: 3001 para o header)
EXPOSE 3003

# O comando para iniciar o servidor de desenvolvimento
CMD ["npm", "start"]