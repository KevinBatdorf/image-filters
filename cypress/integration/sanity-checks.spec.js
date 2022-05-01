// Check support/globals.js for some default checks
// as well as start up and clean up methods
context('Block checks', () => {
    it('Adds the block', () => {
        cy.addBlock('image-filters')
        // Check the block is there
        cy.getPostContent('.wp-block[class$="image-filters"]').should('exist')
    })
})
