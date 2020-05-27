class Observation < ApplicationRecord
  belongs_to :county
  belongs_to :organism

end
