class CountySerializer
  include FastJsonapi::ObjectSerializer
  attributes :id, :name, :geom
end
