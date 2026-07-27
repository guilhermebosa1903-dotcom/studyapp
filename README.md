# Checklist — Fundamentos de oferta, tráfego e copy

Site estático (Vite, sem framework) com o checklist de estudo em 6 fases:
oferta/nicho, dor/promessa, criativo/hook, funil, tráfego e métricas.
O progresso marcado fica salvo no `localStorage` do navegador.

## Estrutura

```
checklist-site/
├── index.html        # ponto de entrada
├── src/
│   ├── main.js        # renderização e lógica (persistência local)
│   ├── data.js         # conteúdo do checklist (edite aqui para mudar fases/itens)
│   └── style.css       # estilos
├── package.json
└── vite.config.js (opcional — não é necessário para este projeto)
```

## Rodar localmente

Requer Node.js 18+.

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`.

## Editar o conteúdo

Todo o conteúdo do checklist (fases, grupos "estudar/praticar" e itens) está
em `src/data.js`. Basta editar esse arquivo — não precisa mexer em `main.js`
nem em `style.css` para adicionar ou remover itens.

## Subir no GitHub

```bash
cd checklist-site
git init
git add .
git commit -m "Checklist inicial"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/checklist-growth-marketing.git
git push -u origin main
```

## Deploy na Vercel

1. Acesse [vercel.com](https://vercel.com) e clique em **Add New → Project**.
2. Importe o repositório que você acabou de subir no GitHub.
3. A Vercel detecta automaticamente que é um projeto Vite — não precisa mudar
   nada nas configurações de build (`npm run build`, output `dist`).
4. Clique em **Deploy**. Em ~30 segundos o site estará no ar em uma URL
   `.vercel.app`.

Qualquer novo `git push` na branch `main` gera um novo deploy automático.

## Observação sobre o progresso salvo

O progresso é salvo por navegador (`localStorage`), não por conta de
usuário. Isso significa que:

- Funciona offline e sem backend.
- Se você marcar itens no celular e depois abrir no notebook, o progresso
  não sincroniza entre os dois — cada dispositivo/navegador tem o seu.
- Limpar os dados do navegador apaga o progresso.

Se no futuro você quiser progresso sincronizado entre dispositivos, dá para
evoluir isso com um backend simples (ex: Supabase) — é só pedir.
