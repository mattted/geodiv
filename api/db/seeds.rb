Dir.glob("#{Rails.root}/db/seeds/*.rb").sort.each { |f| require f }
