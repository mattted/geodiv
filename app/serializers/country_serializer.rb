class CountrySerializer
  include FastJsonapi::ObjectSerializer
  attributes :id, :name, :geom
end
