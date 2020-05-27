puts 'Deleting old organism rows in db'
connection = ActiveRecord::Base.connection()

Organism.delete_all

connection.execute "alter sequence organisms_id_seq restart with 1"

puts

if Organism.all.count.zero?
  puts 'Aggregate and create organism rows'

  copy_sql = <<-SQL
    INSERT INTO organisms(kingdom, phylum, klass, "order", family, genus, sciname)
    SELECT kingdom, phylum, class, orden, family, genus, sciname
    FROM biodiv 
    GROUP BY kingdom, phylum, class, orden, family, genus, sciname;
  SQL

  connection.execute copy_sql
end
