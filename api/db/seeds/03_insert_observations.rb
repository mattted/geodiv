puts 'Deleting old observation rows in db'
connection = ActiveRecord::Base.connection()

Observation.delete_all
drop_sci_name = <<-SQL
  ALTER TABLE observations
  DROP COLUMN IF EXISTS taxid
SQL
connection.execute drop_sci_name

connection.execute "alter sequence observations_id_seq restart with 1"

puts

if Observation.all.count.zero?

  temp_col = <<-SQL
    ALTER TABLE observations
    ADD COLUMN taxid NUMERIC;
  SQL

  copy_sql = <<-SQL
    INSERT INTO observations(lat, lon, date, inat, taxid)
    SELECT lat, lon, date, url, taxid 
    FROM biodiv 
  SQL

  create_geom = <<-SQL
    UPDATE observations SET geom = ST_SetSRID(ST_MakePoint(lon, lat), 4269);
  SQL

  set_county_id = <<-SQL
    UPDATE observations SET county_id = counties.id
    FROM counties
    WHERE ST_Contains(counties.geom, observations.geom)
  SQL

  set_organism_id = <<-SQL
    UPDATE observations SET organism_id = organisms.id
    FROM organisms
    WHERE observations.taxid = organisms.taxid
  SQL

  puts 'Create temp sciname col'
  connection.execute temp_col
  puts 'Create observation rows'
  connection.execute copy_sql
  puts 'Create point geom from lat lon'
  connection.execute create_geom
  puts 'Set county id based on point geometry'
  connection.execute set_county_id
  puts 'Lookup organism_id from organism table'
  connection.execute set_organism_id
  puts 'Drop uneeded sciname column'
  connection.execute drop_sci_name

end
