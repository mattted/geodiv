class CreateOrganisms < ActiveRecord::Migration[6.0]
  def change
    create_table :organisms do |t|
      t.string :species
      t.string :kingdom
      t.string :phylum
      t.string :klass
      t.string :order
      t.string :family
      t.string :genus
      t.string :cname
      t.integer :taxid
    end
    # add_index :organisms, :sciname
  end
end
