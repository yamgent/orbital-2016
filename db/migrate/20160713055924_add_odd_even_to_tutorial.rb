class AddOddEvenToTutorial < ActiveRecord::Migration
  def change
    # see app/models/tutorial.rb for enum
    add_column :tutorials, :odd_even, :integer, default: 0
  end
end
