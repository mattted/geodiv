class CreateObservations < ActiveRecord::Migration[6.0]
  def change
    create_table :observations do |t|
      t.string :uname
      t.datetime :date
      t.decimal :lat
      t.decimal :lon
      t.st_point :geom, srid: 4269
      t.references :observation, foreign_key: true
      t.references :county, foreign_key: true
    end
    
    add_index :observations, :geom, using: :gist
  end
end
