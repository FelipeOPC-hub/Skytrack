/// <reference types="cypress" />

describe('Caso N° 8 - Test End-to-End SkyTrack', () => {
  it('Debe completar el flujo principal de gestión de vuelos y recursos', () => {
    // 1. Entrar al sitio
    cy.visit('http://localhost:5173'); 
    
    // 2. Ver listado de vuelos (Validamos el h1 de tu FlightList.tsx)
    cy.get('h1', { timeout: 15000 }).should('contain', 'SkyTrack');
    
    // 3. Filtrar por estado (Interactuamos con tu select de Estado Operativo)
    cy.get('select').select('Programado', { force: true });
    cy.contains('span', 'Programado', { timeout: 8000 }).should('be.visible');
    
    // 4. Seleccionar un vuelo (Hacemos click en el botón de Editar - el azul con el ícono)
    cy.get('button').find('svg').first().parent().click({ force: true });
    
    // 5. Navegar a Recursos (Validamos el botón de tu Header)
    cy.visit('http://localhost:5173/recursos');
    cy.get('h1').should('contain', 'Recursos SkyTrack');
    
    // 6. Validar datos de tripulación (Paso obligatorio del Caso 8)
    cy.contains('h2', 'Alta de Personal').should('be.visible');
    
    // 7. Simular carga de un recurso (Alta de Aeronave)
    cy.get('input[placeholder*="Modelo"]').type('Boeing 737 Test');
    cy.get('input[placeholder*="Matrícula"]').type('LV-TEST');
    cy.get('button').contains('REGISTRAR EN FLOTA').should('be.visible');
    
    // Volver al panel
    cy.contains('Volver al Panel').click();
    cy.url().should('include', '/vuelos');
  });
});