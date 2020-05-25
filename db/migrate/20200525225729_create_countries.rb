class CreateCountries < ActiveRecord::Migration[6.0]
  def change
    create_table :countries do |t|
      t.string :name
      t.multi_polygon :geom, srid: 4269
    end

    add_index :countries, :geom, using: :gist
  end
end
