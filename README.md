# Encuesta Pucusana 2026 — React

Proyecto frontend de demostración inspirado en la captura proporcionada.

## Incluye

- Diseño responsive para PC y celular.
- Lista de candidatos ordenada por votos.
- Porcentajes calculados automáticamente.
- Selección de candidato y confirmación de voto.
- Bloqueo de un segundo voto en el mismo navegador usando `localStorage`.
- Vista de resultados con barras.
- Botón para reiniciar los datos de demostración.
- Aviso visible de que la encuesta es NO OFICIAL.

## Ejecutar

```bash
npm install
npm run dev
```

Luego abre la dirección que muestre Vite, normalmente `http://localhost:5173`.

## Importante

Los datos incluidos son datos de demostración basados en la referencia visual proporcionada. Para una encuesta real se debe agregar un backend, una base de datos, autenticación/controles anti-fraude y mecanismos para evitar votos duplicados desde distintos dispositivos.
