# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_06_05_190631) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"
  enable_extension "postgis"

  create_table "biodiv", id: false, force: :cascade do |t|
    t.decimal "taxid"
    t.datetime "date"
    t.string "kingdom"
    t.string "phylum"
    t.string "class"
    t.string "orden"
    t.string "family"
    t.string "genus"
    t.string "species"
    t.decimal "lat"
    t.decimal "lon"
    t.string "url"
    t.string "cname"
  end

  create_table "cname", id: false, force: :cascade do |t|
    t.decimal "taxid"
    t.string "cname"
    t.string "language"
  end

  create_table "counties", force: :cascade do |t|
    t.string "name"
    t.string "statefp"
    t.string "countyfp"
    t.geometry "geom", limit: {:srid=>4269, :type=>"multi_polygon"}
    t.bigint "state_id"
    t.index ["geom"], name: "index_counties_on_geom", using: :gist
    t.index ["state_id"], name: "index_counties_on_state_id"
  end

  create_table "countries", force: :cascade do |t|
    t.string "name"
    t.geometry "geom", limit: {:srid=>4269, :type=>"multi_polygon"}
    t.index ["geom"], name: "index_countries_on_geom", using: :gist
  end

  create_table "observations", force: :cascade do |t|
    t.datetime "date"
    t.decimal "lat"
    t.decimal "lon"
    t.string "inat"
    t.geometry "geom", limit: {:srid=>4269, :type=>"st_point"}
    t.bigint "organism_id"
    t.bigint "county_id"
    t.index ["county_id"], name: "index_observations_on_county_id"
    t.index ["date"], name: "index_observations_on_date"
    t.index ["geom"], name: "index_observations_on_geom", using: :gist
    t.index ["organism_id"], name: "index_observations_on_organism_id"
  end

  create_table "organisms", force: :cascade do |t|
    t.string "species"
    t.string "kingdom"
    t.string "phylum"
    t.string "klass"
    t.string "order"
    t.string "family"
    t.string "genus"
    t.string "cname"
    t.integer "taxid"
  end

  create_table "states", force: :cascade do |t|
    t.string "name"
    t.string "statefp"
    t.string "usps"
    t.geometry "geom", limit: {:srid=>4269, :type=>"multi_polygon"}
    t.bigint "country_id"
    t.index ["country_id"], name: "index_states_on_country_id"
    t.index ["geom"], name: "index_states_on_geom", using: :gist
  end

  add_foreign_key "counties", "states"
  add_foreign_key "observations", "counties"
  add_foreign_key "observations", "organisms"
  add_foreign_key "states", "countries"
end
