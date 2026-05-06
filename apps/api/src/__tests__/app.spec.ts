describe('PetShop Gestão', () => {
  it('should be defined', () => {
    expect(true).toBe(true);
  });

  it('should validate environment', () => {
    expect(process.env.NODE_ENV).toBeDefined();
  });
});
