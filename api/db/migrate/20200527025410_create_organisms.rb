class CreateOrganisms < ActiveRecord::Migration[6.0]
  def change
    create_table :organisms do |t|
      t.string :sciname
      t.string :kingdom
      t.string :phylum
      t.string :class
      t.string :order
      t.string :family
      t.string :genus
      t.string :inat
    end
  end
end
