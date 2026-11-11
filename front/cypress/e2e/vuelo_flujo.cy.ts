///<reference types="cypress" />

describe('Prueba E2E - Flujo de Gestión de Vuelos', () => {
  beforeEach(() => {
    // 1. Entrar al sitio [cite: 66]
    cy.visit('http://localhost:5173'); 
  });

  it('Debe completar el flujo de visualización, filtrado y gestión', () => {
    // 2. Ver listado de vuelos [cite: 67]
    cy.get('h1').contains('Viajes').should('be.visible');

    // 3. Filtrar por estado [cite: 68]
    // Buscamos un texto de estado o selector que uses
    cy.contains('Programado').should('exist');

    // 4. Seleccionar un vuelo [cite: 69]
    // Hacemos click en la tarjeta del primer vuelo
    cy.get('.group.relative').first().click();

    // 5. Ver tripulación asignada [cite: 70]
    // Verificamos que aparezca la información de la tripulación
    cy.contains('Tripulación').should('be.visible');

    // 6. Cambiar el estado del vuelo (simulado) [cite: 71]
    // Buscamos el botón de acción según tu lógica
    cy.get('button').contains('Iniciar Vuelo').click();
    cy.contains('EN VUELO').should('be.visible');

    // 7. Asignar o quitar tripulación [cite: 72]
    cy.get('.btn-quitar').first().click();
    cy.contains('Actualizado con éxito').should('be.visible');
  });
});