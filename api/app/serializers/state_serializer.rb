class StateSerializer
  include FastJsonapi::ObjectSerializer
  attributes :id, :name, :geom
end
