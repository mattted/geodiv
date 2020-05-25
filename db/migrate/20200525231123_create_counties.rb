class CreateCounties < ActiveRecord::Migration[6.0]
  def change
    create_table :counties do |t|
      t.string :name
      t.string :statefp
      t.string :countyfp
      t.multi_polygon :geom, srid: 4269
      t.references :state, foreign_key: true
    end

    add_index :counties, :geom, using: :gist
  end
end
