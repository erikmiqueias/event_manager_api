# Usa uma imagem Node oficial com suporte ao npm
FROM node:22

# Define o diretório de trabalho
WORKDIR /app

# Copia apenas os arquivos essenciais para instalar dependências
COPY package.json pnpm-lock.yaml ./

# Instala o pnpm (caso ainda não esteja global)
RUN npm install -g pnpm && pnpm install

# Copia todo o código-fonte
COPY . .

# Compila o TypeScript
RUN pnpm run build

# Expõe a porta (ajuste se for diferente)
EXPOSE 3000

# Comando para rodar a aplicação já compilada
CMD ["node", "dist/index.js"]
