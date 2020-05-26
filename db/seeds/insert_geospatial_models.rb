puts 'Deleting old geographic models in db'
connection = ActiveRecord::Base.connection()

County.delete_all
State.delete_all
Country.delete_all

connection.execute "alter sequence countries_id_seq restart with 1"
connection.execute "alter sequence states_id_seq restart with 1"
connection.execute "alter sequence counties_id_seq restart with 1"

puts

if Country.all.count == 0
  puts 'Importing country data'

  country_sql = `shp2pgsql -c -g geom -W 'UTF-8' -s 4269\
    #{Rails.root.join('db', 'shpfiles', 'cb_2018_us_nation_5m', 'cb_2018_us_nation_5m.shp')} countries_ref`

  connection.execute "drop table if exists countries_ref"
  connection.execute country_sql
  connection.execute <<-SQL
    insert into countries(name, geom)
      select NAME, geom from countries_ref
  SQL

  connection.execute "drop table countries_ref"
end

if State.all.count == 0
  puts 'Importing state data'

  states_sql = `shp2pgsql -c -g geom -W 'UTF-8' -s 4269\
    #{Rails.root.join('db', 'shpfiles', 'cb_2018_us_state_5m', 'cb_2018_us_state_5m.shp')} states_ref`

  connection.execute "drop table if exists states_ref"
  connection.execute states_sql
  connection.execute <<-SQL
    insert into states(name, statefp, usps, country_id, geom)
      select NAME, STATEFP, STUSPS, #{Country.first.id}, geom from states_ref
  SQL

  connection.execute "drop table states_ref"
end

if County.all.count == 0
  puts 'Importing county data'

  counties_sql = `shp2pgsql -c -g geom -W 'UTF-8' -s 4269\
    #{Rails.root.join('db', 'shpfiles', 'cb_2018_us_county_5m', 'cb_2018_us_county_5m.shp')} counties_ref`

  connection.execute "drop table if exists counties_ref"
  connection.execute counties_sql
  connection.execute <<-SQL
    insert into counties(name, statefp, countyfp, geom, state_id)
      select NAME, STATEFP, COUNTYFP, geom, #{1} from counties_ref
  SQL

  connection.execute "drop table counties_ref"

  County.all.each do |county|
    county.state_id = State.find_by(statefp: county.statefp).statefp
    county.save
  end
end
