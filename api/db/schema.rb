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

ActiveRecord::Schema.define(version: 2020_05_25_231123) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"
  enable_extension "postgis"

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
  add_foreign_key "states", "countries"
end
