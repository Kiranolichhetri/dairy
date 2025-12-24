describe('Home Page', () => {
  it('loads and displays the main header', () => {
    cy.visit('http://localhost:5173');
    cy.contains('Khairawang Dairy').should('be.visible');
  });

  it('navigates to Products page', () => {
    cy.visit('http://localhost:5173');
    cy.contains('Products').click();
    cy.url().should('include', '/products');
    cy.contains('Products').should('be.visible');
  });
});
