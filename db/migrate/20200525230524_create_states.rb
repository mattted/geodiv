class CreateStates < ActiveRecord::Migration[6.0]
  def change
    create_table :states do |t|
      t.string :name
      t.string :statefp
      t.string :usps
      t.multi_polygon :geom, srid: 4269
      t.references :country, foreign_key: true
    end

    add_index :states, :geom, using: :gist
  end
end
